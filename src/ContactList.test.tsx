import {
  screen,
  render,
  waitForElementToBeRemoved,
  waitForElement,
  fireEvent,
} from "@testing-library/react";
import React from "react";
import App from "./App";
import mockData from "./mockData.json";

const firstBatchOfData = mockData.slice(150, 152);
const secondBatchOfData = mockData.slice(152, 154);

afterEach(() => {
  jest.resetAllMocks();
});

test("should render elements on the list when fetches successfully", async () => {
  const mockReceiveDataFunc = jest.fn().mockResolvedValue(firstBatchOfData);
  render(<App receiveData={mockReceiveDataFunc} />);
  await waitForElement(() =>
    screen.getByText(firstBatchOfData[0].emailAddress)
  );
  firstBatchOfData.forEach((person) =>
    expect(screen.getByText(person.emailAddress)).toBeInTheDocument()
  );
});

test("should render loading indicator when before fetching data", async () => {
  const mockReceiveDataFunc = jest.fn().mockResolvedValue(firstBatchOfData);
  render(<App receiveData={mockReceiveDataFunc} />);
  const findLoadingElement = () => screen.getByText("Loading...");
  expect(findLoadingElement()).toBeInTheDocument();

  await waitForElementToBeRemoved(() => findLoadingElement());

  firstBatchOfData.forEach((person) =>
    expect(screen.getByText(person.emailAddress)).toBeInTheDocument()
  );
});

test("should render more elements when clicked load more button", async () => {
  const mockReceiveDataFunc = jest
    .fn()
    .mockResolvedValueOnce(firstBatchOfData)
    .mockResolvedValueOnce(secondBatchOfData);
  render(<App receiveData={mockReceiveDataFunc} />);

  await waitForElement(() =>
    screen.getByText(firstBatchOfData[0].emailAddress)
  );

  fireEvent.click(screen.getByText("Load More"));
  expect(screen.getAllByTestId("person-info")).toHaveLength(4);
});
