import { render, fireEvent, screen } from '@testing-library/react';
import Form from './Form';

const setup = () => {
  const { container } = render(<Form />);
  const inputName = screen.getByLabelText('Name');
  const inputPassword1 = screen.getByLabelText('Password (First)');
  const inputPassword2 = screen.getByLabelText('Password (Second)');
  const inputEmail = screen.getByLabelText('Email');
  const submitButton = screen.getByRole('button', { name: /submit/i });
  return {
    inputName,
    inputPassword1,
    inputPassword2,
    inputEmail,
    submitButton,
    container,
    ...screen,
  };
};

test('name field is required', () => {
  const { inputName, submitButton } = setup();
  fireEvent.change(inputName, { target: { value: '' } });
  fireEvent.click(submitButton);
  expect(inputName).toHaveClass('error');
});

test('password fields must match', () => {
  const { inputPassword1, inputPassword2 } = setup();
  fireEvent.change(inputPassword1, { target: { value: '123456' } });
  fireEvent.change(inputPassword2, { target: { value: '654321' } });
  fireEvent.blur(inputPassword2);
  expect(inputPassword2).toHaveClass('error');
});

test('email field must be a valid email address', () => {
  const { inputEmail, submitButton } = setup();
  fireEvent.change(inputEmail, { target: { value: 'invalid' } });
  fireEvent.click(submitButton);
  expect(inputEmail).toHaveClass('error');
});

test('form is valid when all fields are filled correctly', () => {
  const { inputName, inputPassword1, inputPassword2, inputEmail, submitButton } = setup();
  fireEvent.change(inputName, { target: { value: 'John Doe' } });
  fireEvent.change(inputPassword1, { target: { value: '123456' } });
  fireEvent.change(inputPassword2, { target: { value: '123456' } });
  fireEvent.change(inputEmail, { target: { value: 'john.doe@example.com' } });
  fireEvent.click(submitButton);
  expect(submitButton).not.toHaveClass('error');
});

test('reset error state on any change', async () => {
  const { inputName, inputPassword1, inputPassword2, inputEmail, submitButton } = setup();
  fireEvent.change(inputName, { target: { value: 'John Doe' } });
  fireEvent.change(inputPassword1, { target: { value: '123456' } });
  fireEvent.change(inputPassword2, { target: { value: '321' } });
  fireEvent.change(inputEmail, { target: { value: 'john.doe@example.com' } });
  fireEvent.click(submitButton);

  fireEvent.change(inputPassword2, { target: { value: '121' } });

  expect(submitButton).not.toHaveClass('error');
});

test('successful message displays when all fields are filled correctly', () => {
  const { inputName, inputPassword1, inputPassword2, inputEmail, submitButton, container } = setup();
  fireEvent.change(inputName, { target: { value: 'John Doe' } });
  fireEvent.change(inputPassword1, { target: { value: '123456' } });
  fireEvent.change(inputPassword2, { target: { value: '123456' } });
  fireEvent.change(inputEmail, { target: { value: 'john.doe@example.com' } });
  // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
  const formElem = container.getElementsByClassName('form')[0];
  fireEvent.click(submitButton);

  const successBar = screen.getByText('Success!');
  expect(successBar).toBeInTheDocument();
  expect(formElem).not.toBeInTheDocument();
});

test('button change color on hover', () => {
  const { submitButton } = setup();
  fireEvent.mouseOver(submitButton);
  expect(submitButton).toHaveStyle('background-color: #555');
});
