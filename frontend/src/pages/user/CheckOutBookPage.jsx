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
import { format } from "date-fns";
import Spinner from "../../components/spinner/Spinner";
import { BASE_BOOK_IMG_URL } from "../../utils/utils";
import { useSelector } from "react-redux";

const CheckOutBookPage = () => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const { allBooks } = useSelector((state) => state.books);
  const { currentUser, isAuthenticated } = getUser();
  const [selectedDays, setSelectedDays] = useState(7);
  const { getAllBooks, sendCheckInBook } = bookAction();
  const navigate = useNavigate();

  const handleSelectChange = (value) => {
    setSelectedDays(value);
  };

  const handleCheckInBook = async (id) => {
    console.log(id);
    await sendCheckInBook(id);
    // navigate("/");
  };
  useEffect(() => {
    if (!availableBooks.length) {
      getAllBooks();
    }
    setAvailableBooks(allBooks);
  }, []);

  console.log({ availableBooks });
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        minHeight: "100vh",
        p: 3,
        mt: 10,
      }}
    >
      <Typography sx={{ my: 2 }} variant="h4" align="center" gutterBottom>
        Checked Out Books Page
      </Typography>

      {/* News Grid */}
      <Grid container spacing={3}>
        {availableBooks &&
          availableBooks.length > 0 &&
          availableBooks.map((book, index) => {
            if (book && book?.id && book.is_checked_in === false) {
              console.log({
                reader: book.reader_id,
                userId: currentUser,
                andBook: book,
              });
              return (
                <Grid item xs={12} sm={6} md={4} lg={4} key={index + book?.id}>
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
                    <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
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
                                  onClick={(e) => {
                                    handleCheckInBook(book?.id);
                                  }}
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
                    {book.reader_id === currentUser.id &&
                      book.is_checked_in === false &&
                      book.checked_out_date &&
                      book.expected_check_in_date && (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            p: 2,
                          }}
                        >
                          <Typography
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <span>Expected Checkout Date: </span>
                            <span>
                              {format(
                                new Date(book.expected_check_in_date),
                                "dd/MM/yy"
                              )}
                            </span>
                          </Typography>
                          <Typography
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <span>Check out Date:</span>
                            <span>
                              {format(
                                new Date(book.checked_out_date),
                                "dd/MM/yy"
                              )}
                            </span>
                          </Typography>
                        </Box>
                      )}
                  </Card>
                </Grid>
              );
            }
          })}
      </Grid>
    </Box>
  );
};

export default CheckOutBookPage;
