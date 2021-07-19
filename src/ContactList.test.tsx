import { render, screen } from "@testing-library/react";
import React from "react";
import App from "./App";

const mockPersonArray = [
  {
    id: "1",
    jobTitle: "Fabricator",
    emailAddress: "Ron_Giles3711@dionrab.com",
    firstNameLastName: "Ron Giles",
  },
  {
    id: "2",
    jobTitle: "IT Support Staff",
    emailAddress: "Melinda_Mcgregor7556@mafthy.com",
    firstNameLastName: "Melinda Mcgregor",
  },
];

afterEach(() => {
  jest.clearAllMocks();
});

test("should render elements on the list when fetches successfully", async () => {
  jest.mock("./api", () =>
    jest.fn().mockResolvedValueOnce([
      {
        id: "1",
        jobTitle: "Fabricator",
        emailAddress: "Ron_Giles3711@dionrab.com",
        firstNameLastName: "Ron Giles",
      },
      {
        id: "2",
        jobTitle: "IT Support Staff",
        emailAddress: "Melinda_Mcgregor7556@mafthy.com",
        firstNameLastName: "Melinda Mcgregor",
      },
    ])
  );
  render(<App />);
  expect(
    await screen.findByText(mockPersonArray[0].emailAddress)
  ).toBeInTheDocument();
  expect(
    await screen.findByText(mockPersonArray[1].emailAddress)
  ).toBeInTheDocument();
});
