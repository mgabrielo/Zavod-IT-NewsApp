import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { bookAction } from "../../hooks/bookAction";
import { useDispatch } from "react-redux";
import { setAllCheckedInBooks } from "../../redux/book/bookSlice";
import { getUser } from "../../hooks/getUser";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  MenuItem,
  Select,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import DialogBox from "../../components/dialog/Dialog";
import Spinner from "../../components/spinner/Spinner";
import { BASE_BOOK_IMG_URL } from "../../utils/utils";

const Search = ({ marginTop = 12, marginY = 1, content = true }) => {
  const [input, setInput] = useState("");
  const { sendBookSearch, allBooks } = bookAction();
  const { currentUser, isAuthenticated } = getUser();
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedDays, setSelectedDays] = useState(7);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSearch = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      try {
        const result = await sendBookSearch({ title: input, publisher: input }); // Sending title as query
        console.log("Search results:", result);
        setSearchedBooks(result);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        my: marginY,
        mt: marginTop,
        flexDirection: "column",
      }}
    >
      <Box
        display="flex"
        mt={4}
        sx={{
          alignItems: "center",
          gap: 2,
          px: 5,
          flexDirection: { sm: "column", md: "row", lg: "row", xl: "row" },
          mb: 5,
        }}
      >
        <TextField
          fullWidth
          label="Search"
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      {content && (
        <Grid container spacing={3}>
          {searchedBooks &&
            searchedBooks.length > 0 &&
            searchedBooks.map((book, index) => {
              if (book && book?.id) {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={book?.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={`${BASE_BOOK_IMG_URL}/${book.cover_page_image}`}
                        alt={book.title}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {book.title}
                        </Typography>

                        <Typography
                          variant="h3"
                          sx={{ mt: 3, fontSize: 16 }}
                          gutterBottom
                        >
                          {book.description.length > 50
                            ? book.description.substring(0, 50) + "..."
                            : book.description}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 1,
                            alignItems: "center",
                          }}
                        >
                          <Typography>Authors:</Typography>
                          {book.authors &&
                            book.authors?.length > 0 &&
                            book.authors?.map((author, author_index) => (
                              <Typography
                                key={author_index}
                                variant="h3"
                                sx={{
                                  fontSize: 16,
                                  color: "#808080",
                                  cursor: "pointer",
                                  mt: 1,
                                }}
                                gutterBottom
                              >
                                {author}
                              </Typography>
                            ))}
                        </Box>
                      </CardContent>
                      <CardActions
                        sx={{ justifyContent: "space-between", p: 2 }}
                      >
                        {currentUser && (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                flex: 1,
                              }}
                            >
                              {book.is_checked_in === true && (
                                <Box sx={{ p: 2 }}>
                                  <Typography variant="body2">
                                    Select Borrowing Duration:
                                  </Typography>
                                  <Select
                                    value={selectedDays} // Default to 7 days
                                    onChange={
                                      (e) => {}
                                      //   handleSelectChange(e.target.value)
                                    }
                                    fullWidth
                                    size="small"
                                  >
                                    {[7, 14, 21, 28].map((days) => (
                                      <MenuItem key={days} value={days}>
                                        {days} days
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </Box>
                              )}
                              {currentUser && book.is_checked_in === true && (
                                <Button
                                  variant="contained"
                                  color="error"
                                  onClick={(e) => {
                                    navigate(`/upload-book/${book?.id}`);
                                  }}
                                  sx={{
                                    fontSize: 12,
                                    textTransform: "capitalize",
                                  }}
                                >
                                  Update
                                </Button>
                              )}

                              {book.reader_id === currentUser.id &&
                                book.is_checked_in === false && (
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={
                                      (e) => {}
                                      //   handleCheckInBook(book?.id);
                                    }
                                    sx={{
                                      fontSize: 12,
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {book.is_checked_in === true
                                      ? "Check Out"
                                      : "Check In"}
                                  </Button>
                                )}
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                              }}
                            >
                              <Typography
                                variant="outlined"
                                color="success"
                                sx={{
                                  color: "#000",
                                  fontWeight: "bold",
                                  fontSize: 15,
                                }}
                              >
                                Rev No: {book.revision_number}
                              </Typography>
                              <Typography
                                variant="outlined"
                                color="success"
                                sx={{
                                  color: "#000",
                                  fontWeight: "bold",
                                  fontSize: 15,
                                }}
                              >
                                Genre: {book.genre}
                              </Typography>
                            </Box>
                          </>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                );
              }
            })}
        </Grid>
      )}
    </Box>
  );
};

export default Search;
