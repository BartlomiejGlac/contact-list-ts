import {
  screen,
  render,
  waitForElementToBeRemoved,
  wait,
  waitForElement,
} from "@testing-library/react";
import React from "react";
import App from "./App";

const mockPersonArray = [
  {
    id: "151",
    jobTitle: "Stockbroker",
    emailAddress: "Vera_Janes1389@corti.com",
    firstNameLastName: "Vera Janes",
  },
  {
    id: "152",
    jobTitle: "Inspector",
    emailAddress: "Janelle_Chappell9153@zorer.org",
    firstNameLastName: "Janelle Chappell",
  },
];

jest.mock("./api", () =>
  jest.fn().mockImplementation(() => Promise.resolve(mockPersonArray))
);

afterEach(() => {
  jest.clearAllMocks();
});

test("should render elements on the list when fetches successfully", async () => {
  render(<App />);
  await waitForElement(() => screen.getByText(mockPersonArray[0].emailAddress));
  expect(screen.getByText(mockPersonArray[0].emailAddress)).toBeInTheDocument();
  expect(screen.getByText(mockPersonArray[1].emailAddress)).toBeInTheDocument();
});

test("should render loading indicator when before fetching data", async () => {
  render(<App />);
  const findLoadingElement = () => screen.getByText("Loading...");
  expect(findLoadingElement()).toBeInTheDocument();

  await waitForElementToBeRemoved(() => findLoadingElement());

  mockPersonArray.forEach((person) =>
    expect(screen.getByText(person.emailAddress)).toBeInTheDocument()
  );
});
