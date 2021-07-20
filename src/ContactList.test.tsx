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

const getDefaultMockResolvingFirstDataBatch = () =>
  jest.fn().mockResolvedValue(firstBatchOfData);

const findLoadingElement = () => screen.queryByText("Loading...");

test("should render elements on the list when fetches successfully", async () => {
  const mockReceiveDataFunc = getDefaultMockResolvingFirstDataBatch();

  render(<App receiveData={mockReceiveDataFunc} />);
  await waitForElement(() =>
    screen.getByText(firstBatchOfData[0].emailAddress)
  );

  firstBatchOfData.forEach((person) =>
    expect(screen.getByText(person.emailAddress)).toBeInTheDocument()
  );
});

test("should render loading indicator before fetching data", async () => {
  const mockReceiveDataFunc = getDefaultMockResolvingFirstDataBatch();

  render(<App receiveData={mockReceiveDataFunc} />);

  expect(findLoadingElement()).toBeInTheDocument();

  //making sure nothing renders after test
  await waitForElementToBeRemoved(() => findLoadingElement());
});

test("should remove loading indicator after fetching data", async () => {
  const mockReceiveDataFunc = getDefaultMockResolvingFirstDataBatch();

  render(<App receiveData={mockReceiveDataFunc} />);

  await waitForElementToBeRemoved(() => findLoadingElement());

  expect(findLoadingElement()).toBeNull();
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
  const numberOfItemsBeforeButtonClick = screen.getAllByTestId("person-info");

  fireEvent.click(screen.getByText("Load More"));

  await waitForElement(() =>
    screen.getByText(secondBatchOfData[0].emailAddress)
  );
  const numberOfItemsAfterButtonClick = screen.getAllByTestId("person-info");

  expect(numberOfItemsBeforeButtonClick).toHaveLength(firstBatchOfData.length);
  expect(numberOfItemsAfterButtonClick).toHaveLength(
    firstBatchOfData.length + secondBatchOfData.length
  );
});

test("should display error message when fetching data failure", async () => {
  const mockReceiveDataFunc = jest
    .fn()
    .mockRejectedValue(new Error("Something went wrong"));

  render(<App receiveData={mockReceiveDataFunc} />);
  const element = await waitForElement(() =>
    screen.getByText("Sorry, sommething went wrong, please try again")
  );

  expect(element).toBeInTheDocument();
});

test("should not display error message when fetching data succeed", async () => {
  const mockReceiveDataFunc = getDefaultMockResolvingFirstDataBatch();

  render(<App receiveData={mockReceiveDataFunc} />);
  await waitForElement(() =>
    screen.getByText(firstBatchOfData[0].emailAddress)
  );

  expect(
    screen.queryByText("Sorry, sommething went wrong, please try again")
  ).toBeNull();
});

test("should show selected elements first", async () => {
  const mockReceiveDataFunc = getDefaultMockResolvingFirstDataBatch();

  render(<App receiveData={mockReceiveDataFunc} />);
  await waitForElement(() =>
    screen.getByText(firstBatchOfData[0].emailAddress)
  );
  const listElementsBeforeSelect = screen.getAllByTestId("person-info");

  fireEvent.click(screen.getByText(firstBatchOfData[1].emailAddress));
  const listElementsAffterSelect = screen.getAllByTestId("person-info");

  expect(listElementsBeforeSelect[0]).toHaveTextContent(
    firstBatchOfData[0].emailAddress
  );
  expect(listElementsAffterSelect[0]).toHaveTextContent(
    firstBatchOfData[1].emailAddress
  );
});

test("should render elements in previous order when element deselected", async () => {
  const mockReceiveDataFunc = getDefaultMockResolvingFirstDataBatch();

  render(<App receiveData={mockReceiveDataFunc} />);
  await waitForElement(() =>
    screen.getByText(firstBatchOfData[0].emailAddress)
  );

  fireEvent.click(screen.getByText(firstBatchOfData[1].emailAddress));
  fireEvent.click(screen.getByText(firstBatchOfData[1].emailAddress));

  const listElementsAffterDeselect = screen.getAllByTestId("person-info");

  expect(listElementsAffterDeselect[0]).toHaveTextContent(
    firstBatchOfData[0].emailAddress
  );
});
