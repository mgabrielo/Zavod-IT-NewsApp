import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { MemoryRouter } from "react-router-dom";
import { userEvent } from "@testing-library/user-event";
import Register from "../src/pages/auth/Register";

describe("Register component", () => {
  it("should complete registration", async () => {
    const navigate = vi.fn();
    const currentUser = vi.fn();
    render(<Register />, {
      wrapper: ({ children }) => (
        <Provider store={store}>
          <MemoryRouter>{children}</MemoryRouter>
        </Provider>
      ),
      mocks: {
        useNavigate: vi.fn(() => navigate),
        useSelector: vi.fn(() => ({ currentUser })),
      },
    });
    expect(screen.getByLabelText("Username").firstChild);
    expect(screen.getByLabelText("Email").firstChild);
    expect(screen.getByLabelText("Password").firstChild);
    expect(screen.getAllByText("Confirm Password").at(0));
    expect(screen.getByRole("button", { name: /Register/i }));

    const username = "testuser";
    const email = "test@example.com";
    const password = "password123";

    userEvent.type(screen.getByPlaceholderText("Enter Username"), username);
    userEvent.type(screen.getByPlaceholderText("Enter Email"), email);
    userEvent.type(screen.getByPlaceholderText("Enter Password"), password);
    userEvent.type(
      screen.getByPlaceholderText("Confirm Your Password"),
      password
    );
    userEvent.click(screen.getByRole("button", { name: /Register/i }));
    await waitFor(() => {
      expect(() => screen.findByText(/User registered successfully/i));
      expect(() => screen.getByRole("button", { name: /Login/i }));
    });
  });
});
