import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { bookAction } from "../../hooks/bookAction";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import format from "date-fns/format";

const UploadBookPage = () => {
  const { bookId } = useParams();
  const parsedBookId = Number(bookId);
  const isInteger = Number.isInteger(parsedBookId);
  const isText = isNaN(parsedBookId);
  console.log({ bookId });
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [genreInput, setGenreInput] = useState("");
  const [authorInput, setAuthorInput] = useState("");
  const [inputDate, setInputDate] = useState("");
  const { allBooks, uploadABook, updateABook } = bookAction();
  const [bookData, setBookData] = useState({});
  const { handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      isbn: "",
      revision_number: 1,
      published_date: "",
      description: "",
      authors: [],
      genre: "",
      publisher: "",
    },
  });

  const availableTags = [
    // ...new Set(news.flatMap((newsItem) => newsItem.tags || [])),
  ];

  const availableGenre = [
    ...new Set(allBooks.flatMap((book) => book.genre || [])),
  ];

  const availableAuthors = [
    ...new Set(allBooks.flatMap((book) => book.authors || [])),
  ];

  //   const selectedTags = watch("tags") || [];
  const selectedGenre = watch("genre") || [];
  const selectedAuthors = watch("authors") || [];

  // Image Upload Handler
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB.");
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Form Submission Handler
  const onSubmit = async (data) => {
    const formData = new FormData();
    console.log({ submit_data: data, genreInput, authorInput });
    const {
      title,
      description,
      authors,
      published_date,
      revision_number,
      isbn,
      genre,
      publisher,
    } = data;
    const authorInputArray = tagInput.split(",").map((item) => item.trim());
    // tags.push(tagInput);
    const allAuthors = [...authors, ...authorInputArray];
    if (!title || !description || !selectedImage || allAuthors.length === 0) {
      toast.error("Please fill all fields and add at least one tag.");
      return;
    }

    formData.append("title", title);
    formData.append("description", description);
    formData.append("authors", JSON.stringify(allAuthors));
    formData.append("book_cover_image", selectedImage);
    formData.append("published_date", published_date);
    formData.append("publisher", publisher);
    formData.append("genre", genre);
    formData.append("isbn", isbn);
    formData.append("revision_number", revision_number);

    try {
      if (bookData.id) {
        await updateABook(formData, bookData.id);
      } else {
        await uploadABook(formData);
      }
      reset();
      setSelectedImage(null);
      setPreviewImage("");
      navigate("/");
      toast.success("News Saved successfully!");
    } catch (error) {
      console.error("Error adding news:", error);
      toast.error("Failed to add news!");
    }
  };

  useEffect(() => {
    if (isInteger) {
      const bookResult = allBooks
        .filter((book) => book.is_checked_in)
        .find((bookData) => bookData.id == bookId);
      if (bookResult) {
        setBookData(bookResult);
      }
    }
  }, [isInteger, bookId]);

  useEffect(() => {
    if (bookData && Object.keys(bookData).length > 0) {
      reset({
        title: bookData.title || "",
        isbn: bookData.isbn || "",
        revision_number: bookData.revision_number || 1,
        published_date: bookData.published_date || "",
        description: bookData.description || "",
        authors: bookData.authors || [],
        genre: bookData.genre || "",
        publisher: bookData.publisher || "",
      });
    }
  }, [bookData, reset]);
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", sm: "70%", md: "50%" },
          mx: "auto",
          my: 15,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "white",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          {isText ? "Upload A Book" : "Update A Book"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          {/* Title */}
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Title"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="isbn"
            control={control}
            rules={{ required: "ISBN is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="ISBN"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="publisher"
            control={control}
            rules={{ required: "Publisher is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Publisher"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="revision_number"
            control={control}
            rules={{
              required: "Revision Number is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Only whole numbers are allowed",
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Revision Number"
                fullWidth
                type="number"
                inputProps={{ min: 0, step: 1 }}
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
              />
            )}
          />

          {/* Text */}
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Description"
                multiline
                rows={4}
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />

          {/* Image Upload */}
          <Box sx={{ my: 2 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="upload-image"
            />
            <label htmlFor="upload-image">
              <Button
                variant="contained"
                component="span"
                fullWidth
                sx={{ textTransform: "capitalize" }}
              >
                Upload Cover Page Image
              </Button>
            </label>
            {previewImage && (
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <img
                  src={previewImage}
                  alt="Preview"
                  width="200px"
                  height="200px"
                />
              </Box>
            )}
          </Box>

          {/* Genre Selection */}
          <Controller
            name="genre"
            control={control}
            rules={{ required: "Genre is required" }}
            render={({ field, fieldState }) => (
              <Autocomplete
                freeSolo
                options={availableGenre}
                value={field.value || ""}
                onChange={(_, newValue) =>
                  setValue("genre", newValue, { shouldValidate: true })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Genre"
                    margin="normal"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    value={field.value || ""}
                    onChange={(event) =>
                      setValue("genre", event.target.value, {
                        shouldValidate: true,
                      })
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && field.value.trim() !== "") {
                        event.preventDefault();
                        setValue("genre", field.value.trim(), {
                          shouldValidate: true,
                        });
                      }
                    }}
                  />
                )}
              />
            )}
          />

          {/* Author Selection */}
          <Controller
            name="authors"
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                freeSolo
                options={availableAuthors}
                value={selectedAuthors}
                onChange={(_, newValue) =>
                  setValue("authors", newValue, { shouldValidate: true })
                }
                filterSelectedOptions
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      key={index}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Authors"
                    margin="normal"
                    value={authorInput}
                    onChange={(event) => setAuthorInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && authorInput.trim() !== "") {
                        event.preventDefault();
                        const newAuthor = authorInput.trim();

                        if (!selectedAuthors.includes(newAuthor)) {
                          setValue("authors", [...selectedAuthors, newAuthor], {
                            shouldValidate: true,
                          });
                        }

                        setTagInput(""); // Clear input
                      }
                    }}
                  />
                )}
              />
            )}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Controller
              name="published_date"
              control={control}
              rules={{ required: "Published date is required" }}
              render={({ field, fieldState }) => (
                <DatePicker
                  label="Published Date"
                  value={field.value || null}
                  onChange={(newValue) => {
                    setValue("published_date", newValue, {
                      shouldValidate: true,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />
          </LocalizationProvider>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default UploadBookPage;
