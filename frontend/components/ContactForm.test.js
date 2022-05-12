import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test('renders without errors', () => {
  render(<ContactForm />)
});

test('renders the contact form header', () => {
  render(<ContactForm />)
  const header = screen.queryByText(/contact form/i)
  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy();
  expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
  render(<ContactForm />)
  const firstName = screen.getByLabelText(/first name\*/i);
  userEvent.type(firstName, "123");

  const errorMessage = await screen.findAllByTestId('error');
  expect(errorMessage).toHaveLength(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm />)
  const submit = screen.getByRole('button')
  userEvent.click(submit)

  await waitFor(() => {
    const errorMessages = screen.queryAllByTestId("error");
    expect(errorMessages).toHaveLength(3);
  })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  render(<ContactForm />)
  const firstName = screen.getByLabelText(/first name\*/i);
  userEvent.type(firstName, '12345');

  const lastName = screen.getByLabelText(/last name\*/i);
  userEvent.type(lastName, '12345');

  const submit = screen.getByRole('button')
  userEvent.click(submit)

  const errorMessage = await screen.findAllByTestId('error');
  expect(errorMessage).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm />)
  const email = screen.getByLabelText(/email\*/i);
  userEvent.type(email, 'habenero');
 
  
  const errorMessage = await screen.findByText(/email must be a valid email address/i);
  expect(errorMessage).toBeInTheDocument(1);
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm />)

  const submit = screen.getByRole('button')
  userEvent.click(submit)

  const errorMessage = await screen.findByText(/lastName is a required field/i);
  expect(errorMessage).toBeInTheDocument(1);
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm />)
  const firstName = screen.getByLabelText(/first name\*/i);
  userEvent.type(firstName, '123456');

  const lastName = screen.getByLabelText(/last name\*/i);
  userEvent.type(lastName, '12345');

  const email = screen.getByLabelText(/email\*/i);
  userEvent.type(email, 'habenero@gmail.com');

  const submit = screen.getByRole('button')
  userEvent.click(submit);

  await waitFor(() => {
   const validFirstName = screen.queryByText('123456');
   const validLastName = screen.queryByText('12345');
   const validEmail = screen.queryByText('habenero@gmail.com');
   const validMessage = screen.queryByTestId('message');

   expect(validFirstName).toBeInTheDocument()
   expect(validLastName).toBeInTheDocument()
   expect(validEmail).toBeInTheDocument()
   expect(validMessage).not.toBeInTheDocument()
  })
});

test('renders all fields text when all fields are submitted.', async () => {
  render(<ContactForm />)
  
  const firstName = screen.getByLabelText(/first name\*/i);
  userEvent.type(firstName, '123456');

  const lastName = screen.getByLabelText(/last name\*/i);
  userEvent.type(lastName, '12345');

  const email = screen.getByLabelText(/email\*/i);
  userEvent.type(email, 'habenero@gmail.com');

  const message = screen.getByLabelText(/message/i);
  userEvent.type(message, 'adskfjadksjkf')

  const submit = screen.getByRole('button')
  userEvent.click(submit);

  await waitFor(() => {
   const validFirstName = screen.queryByText('123456');
   const validLastName = screen.queryByText('12345');
   const validEmail = screen.queryByText('habenero@gmail.com');
   const validMessage = screen.queryByText('adskfjadksjkf');

   expect(validFirstName).toBeInTheDocument()
   expect(validLastName).toBeInTheDocument()
   expect(validEmail).toBeInTheDocument()
   expect(validMessage).toBeInTheDocument()
  })
});
