# Scheduler

This is a project written for a code challenge for a front-end developer position.

The goal was as follows:
* Build a form that allows the user to request appointments, giving a date, start time, and end time.
* Allow the user to request multiple appointments.
* Do not allow the user to create appointments in the past.
* Do not allow the user to create appointments that intersect with each other.

## Description of the project

To combine these requirements, as well as the desired goal of making it easy to see where there might be a conflict, I produced the following interface:
* The user sees a list of "forms"--I put this word in quotes because, with React (and Javascript in general), unless you're doing an explicit submit, there's no real need for `<form>` elements.
    * Specifically, each form is a component called DateSelection, using the function-based component interface.
* The list itself is a DateList component, using class-based components.
* Because validation requires checking the appointments against each other, it's easiest to do that in a centralized place, so I have the DateSelection components send data back up to the DateList.  The update logic is somewhat abstracted, though, so the DateSelection could be swapped out for other date picker interfaces without too much trouble.
* The DateList has a `focus` attribute that points to an appointment; only the focused appointment can be edited.  This is so that there is an explicit "culprit" for any conflicts.  Submitting removes focus.
* If the set of appointments is not valid, the focused appointment cannot be submitted.  Invalidity can occur because:
    * The appointment hasn't been filled out yet,
    * the appointment is in the past,
    * the start time comes after the end time (this wasn't mentioned in the requirements, but such appointments don't make sense),
    * or because two appointments overlap.
* To allow for mistakes, there is a "Delete" button on each appointment.
    * Unlike modification, the user can delete unfocused appointments, because this can only ever turn an invalid set of appointments valid, not the other way around.
    * Furthermore, it seems like it would be common to have a conflict and realize you don't want the other appointment.
    * However, it's pretty important if you delete something, so I put up a confirm dialog.

## Future directions

Given the limited scope of the problem, this is a limited piece of code.  Things I can think of to expand it are:
* Create a visual depiction of the appointments using, say, [fullcalendar](https://fullcalendar.io/).  Luckily, the data model is already well-suited for this task.
* Connect to an actual API.  This would be the bare requirement for making a production app.
* Related to the above, persistence.  When you refresh, all the appointments go away.  In practice, we'd want to load existing appointments from an API.
* Styling.  Because I don't have a style guide for the company requesting this challenge, I mostly used a pretty bare style, focused on separating and lining up the elements for ease of use rather than heavy aesthetic considerations.  Given a style guide and existing CSS, I would want to match this to form a consistent style.
* Testing.  Currently, this code is effectively untested, as my familiarity with front-end testing and the related frameworks are low.  I would want to write tests that produce various overlapping and non-overlapping scenarios, and ensure that the submit button is present or absent in these circumstances.

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and you can run the below scripts, inherited from create-react-app, to run the program.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

Currently, the test runner only includes the default included test.  In a production version of this, I would want to add at least some tests.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
