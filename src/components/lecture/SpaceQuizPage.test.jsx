import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SpaceQuizPage from "./QuizPage";
import "@testing-library/jest-dom";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
  console.warn.mockRestore();
});

describe("SpaceQuizPage Component", () => {
  test("renders the quiz page correctly", () => {
    render(
      <BrowserRouter>
        <SpaceQuizPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Space Adventure Quiz/i)).toBeInTheDocument();
    expect(screen.getByText(/Complete this quiz to earn your Space Explorer Badge/i)).toBeInTheDocument();
  });

  test("renders all questions", () => {
    render(
      <BrowserRouter>
        <SpaceQuizPage />
      </BrowserRouter>
    );

    const questions = [
      "What planet do we live on?",
      "What is the big bright star in our sky?",
      "What do astronauts wear in space?",
    ];

    questions.forEach((question) => {
      expect(screen.getByText(question)).toBeInTheDocument();
    });
  });

  test("disables submit button when not all questions are answered", () => {
    render(
      <BrowserRouter>
        <SpaceQuizPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByText(/Submit Quiz/i);
    expect(submitButton).toBeDisabled();
  });
});
