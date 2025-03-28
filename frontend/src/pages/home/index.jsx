import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookAction } from "../../hooks/bookAction";
import { getUser } from "../../hooks/getUser";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  MenuItem,
  Select,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import DialogBox from "../../components/dialog/Dialog";
import Spinner from "../../components/spinner/Spinner";
import { BASE_BOOK_IMG_URL } from "../../utils/utils";
import Search from "../user/SearchPage";

const HomeLibrary = () => {
  const { currentUser, isAuthenticated } = getUser();
  const { allBooks, getAllBooks, sendCheckOutBook } = bookAction();
  const [availableBooks, setAvailableBooks] = useState([]);
  const [bookUpdateId, setBookUpdateId] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [selectedDays, setSelectedDays] = useState(7);
  const navigate = useNavigate();

  const handleSelectChange = (value) => {
    setSelectedDays(value);
  };

  useEffect(() => {
    getAllBooks();
    setAvailableBooks(allBooks);
  }, []);

  useEffect(() => {
    if (selectedBookId && selectedDays) {
      sendCheckOutBook(selectedBookId, selectedDays);
      setSelectedBookId(null);
    }
  }, [selectedDays, selectedBookId]);
  console.log({ availableBooks });
  console.log({ allBooks });
  console.log({ selectedDays });

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 3,
        my: 8,
        mt: 12,
        flexDirection: "column",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Library Page
      </Typography>

      {/* {isAuthenticated && <Search marginTop={1} content={false} />} */}

      <Grid container spacing={3}>
        {availableBooks &&
          availableBooks.length > 0 &&
          availableBooks.map((book, index) => {
            if (book && book?.id && book.is_checked_in === true) {
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
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          // pt: 2,
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
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between", p: 1 }}>
                      {currentUser && (
                        <>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 1,
                              flex: 1,
                            }}
                          >
                            {book.is_checked_in === true && (
                              <Box sx={{ p: 1 }}>
                                <Typography variant="body2" sx={{ py: 1 }}>
                                  Select Borrowing Duration:
                                </Typography>
                                <Select
                                  value={selectedDays} // Default to 7 days
                                  onChange={(e) =>
                                    handleSelectChange(e.target.value)
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
                            {currentUser.role === "admin" && (
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

                            <Button
                              variant="contained"
                              color="error"
                              onClick={(e) => {
                                book.is_checked_in === true
                                  ? setSelectedBookId(book?.id)
                                  : null;
                              }}
                              sx={{ fontSize: 12, textTransform: "capitalize" }}
                            >
                              {book.is_checked_in === true
                                ? "Check Out"
                                : "Check In"}
                            </Button>
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
    </Box>
  );
};

export default HomeLibrary;
