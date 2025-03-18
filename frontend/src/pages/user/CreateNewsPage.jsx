import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Chip,
} from "@mui/material";
import { newsAction } from "../../hooks/newsAction";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const CreateNewsPage = () => {
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [tagInput, setTagInput] = useState("");
  const { addNews, fetchAllNews, news } = newsAction();
  const { handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      text: "",
      tags: [],
    },
  });

  const availableTags = [
    ...new Set(news.flatMap((newsItem) => newsItem.tags || [])),
  ];
  const selectedTags = watch("tags") || [];

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
    const { title, text, tags } = data;
    const tagInputArray = tagInput.split(",").map((item) => item.trim());
    // tags.push(tagInput);
    const allTags = [...tags, ...tagInputArray];
    console.log({ allTags });
    if (!title || !text || !selectedImage || allTags.length === 0) {
      toast.error("Please fill all fields and add at least one tag.");
      return;
    }

    formData.append("title", title);
    formData.append("text", text);
    formData.append("tags", JSON.stringify(allTags));
    formData.append("picture", selectedImage);

    try {
      await addNews(formData);
      await fetchAllNews();
      reset();
      setSelectedImage(null);
      setPreviewImage("");
      navigate("/news");
      toast.success("News added successfully!");
    } catch (error) {
      console.error("Error adding news:", error);
      toast.error("Failed to add news!");
    }
  };

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
          Add News Content
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

          {/* Text */}
          <Controller
            name="text"
            control={control}
            rules={{ required: "Text is required" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Text"
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
              <Button variant="contained" component="span" fullWidth>
                Upload Image
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

          {/* Tags Selection */}
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                freeSolo
                options={availableTags}
                value={selectedTags}
                onChange={(_, newValue) =>
                  setValue("tags", newValue, { shouldValidate: true })
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
                    label="Tags"
                    margin="normal"
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && tagInput.trim() !== "") {
                        event.preventDefault();
                        const newTag = tagInput.trim();

                        if (!selectedTags.includes(newTag)) {
                          setValue("tags", [...selectedTags, newTag], {
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

export default CreateNewsPage;
