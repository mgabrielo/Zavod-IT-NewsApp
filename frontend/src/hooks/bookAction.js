import { useState } from "react";
import { BASE_URL } from "../utils/utils";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllBooks, setAllCheckedInBooks } from "../redux/book/bookSlice";

export const bookAction = () => {
  const { allCheckedInBooks, allBooks } = useSelector((state) => state.books);
  const dispatch = useDispatch();
  const getAllBooks = async () => {
    const { data } = await axios.get(`${BASE_URL}/books/all-books`);
    console.log({ data });
    if (data?.books && data?.books?.length > 0) {
      dispatch(setAllBooks(data.books));
      const checkedIn_books = data.books.filter(
        (book) => book.is_checked_in === false
      );
      dispatch(setAllCheckedInBooks(checkedIn_books));
    }
  };

  const uploadABook = async (formData) => {
    console.log({ formData });
    const { data } = await axios.post(
      `${BASE_URL}/books/upload-book`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log({ addedBook: data });
    getAllBooks();
  };

  const updateABook = async (formData, id) => {
    const { data } = await axios.patch(
      `${BASE_URL}/books/update-book/${id}`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log({ updatedBook: data });
    getAllCheckInBooks();
  };
  const sendCheckOutBook = async (bookId, days_to_borrow) => {
    const formData = { book_id: bookId, days_to_borrow };
    console.log(formData);
    const { data } = await axios.patch(
      `${BASE_URL}/books/checkout-selected-book`,
      formData,
      {
        withCredentials: true,
      }
    );
    getAllBooks();
    const checkedIn_books = allBooks.filter(
      (book) => book.is_checked_in === false
    );
    dispatch(setAllCheckedInBooks(checkedIn_books));
  };
  const sendCheckInBook = async (bookId) => {
    console.log({ sentId: bookId });
    const { data } = await axios.get(
      `${BASE_URL}/books/checkin-selected-book/${bookId}`,
      {
        withCredentials: true,
      }
    );
    getAllBooks();
    const checkedIn_books = allBooks.filter(
      (book) => book.is_checked_in === false
    );
    dispatch(setAllCheckedInBooks(checkedIn_books));
  };

  const sendBookSearch = async ({ title, isbn, publisher }) => {
    const { data } = await axios.get(`${BASE_URL}/books/search-books`, {
      params: { title, publisher },
      withCredentials: true,
    });
    return data.books;
  };
  return {
    allBooks,
    allCheckedInBooks,
    getAllBooks,
    uploadABook,
    updateABook,
    sendCheckOutBook,
    sendCheckInBook,
    sendBookSearch,
  };
};
