import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import { newsAction } from "../../hooks/newsAction";

const CreateNewsPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const { addNews } = newsAction();
  const { handleSubmit, control, reset, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      text: "",
      tags: [],
    },
  });
  // Example Tags (Replace with API call if needed)
  const availableTags = [
    "Politics",
    "Business",
    "Technology",
    "Sports",
    "Health",
  ];

  // Handle Image Selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate File Type
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      // Validate File Size (Limit: 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB.");
        return;
      }
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const selectedTags = watch("tags");

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("text", data.text);
    formData.append("tags", JSON.stringify(data.tags)); // Convert array to JSON string
    if (selectedImage) {
      formData.append("picture", selectedImage); // Append the image file
    }

    try {
      const { newsId } = addNews(formData);
      reset(); // Clear form after submission
      setSelectedImage(null);
      setPreviewImage("");
    } catch (error) {
      console.error("Error adding news:", error);
      alert("Failed to add news!");
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
        bgcolor: "#f5f5f5", // Light gray background for contrast
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
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
          Add News Content
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
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
                value={selectedTags}
                options={availableTags}
                onChange={(_, newValue) => {
                  setValue("tags", newValue, { shouldValidate: true }); // Ensures tags update correctly
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Tags" margin="normal" />
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
