import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Login from "../src/pages/auth/Login";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../src/redux/store";
import { userEvent } from "@testing-library/user-event";

describe("Login component", () => {
  it("should complete user login", async () => {
    const navigate = vi.fn();
    const currentUser = vi.fn();
    render(<Login />, {
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
    expect(screen.getByLabelText("Email"));
    expect(screen.getByLabelText("Password").firstChild);
    expect(screen.getByRole("button", { name: /Login/i }));

    const email = "test@example.com";
    const password = "password123";

    userEvent.type(screen.getByPlaceholderText("Enter Email"), email);
    userEvent.type(screen.getByPlaceholderText("Enter Password"), password);

    userEvent.click(screen.getByRole("button", { name: /Login/i }));
    await waitFor(() => {
      expect(() => screen.findByText(/Login Successful/i));
    });
  });
});
