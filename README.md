# CRUK technical exercise (React)

## Task details

- We will be testing your ability to understand an existing React/Typescript codebase, find what is already built, and what is not.
- You will be building a form using the CRUK React Component Library controlled by ReactHookForm which uses a Zod validation schema.
- This form which will fetch items from the NASA Library API. The "Form fields" section below describes the fields and their validation which should modify the search query.
- The media returned should be displayed in list below the form, these may be images, video, or audio clips. It is up to you how you display these
- The user should only see the first 10 items on the page. If you have time enabling pagination is a stretch target.
- Code must be clean and production ready, quality is better than quantity.
- You can test your application with Playwright, see src/test folder for example tests and see all the scripts available in the package.json
- Feel free to edit this readme or add a new readme file for any additional information, such as what you might do improve your application in the future.
- Please do not attempt to push to this repo, please create your own fork.

## Tools to be used

- NextJS (server) https://nextjs.org/docs
- NASA Images and Video Library API https://api.nasa.gov/
- CRUK React Component Library Storybook site: https://master.d28a8la187lo73.amplifyapp.com/
- CRUK React Component Library Package: https://www.npmjs.com/package/@cruk/cruk-react-components
- Styled Components (what the CRUK Component Library was built with) https://styled-components.com/docs
- React Hook Form (forms): https://react-hook-form.com/
- Zod (validation) https://zod.dev/

## Form fields

This form has 3 fields and error messages should appear below each field.

### Keywords field

| Attribute | Value    |
| :-------- | :------- |
| Label     | Keywords |
| Name      | keywords |
| Required  | true     |
| Type      | text     |
| Default   | ""       |

### Keywords validation

| Type       | Value | Message                                     |
| :--------- | :---- | :------------------------------------------ |
| min length | 2     | "keywords must have at least 2 characters." |
| max length | 50    | "keywords must have at most 50 characters." |

An error message should appear below the field

### Media type field

| Attribute | Value                       |
| :-------- | :-------------------------- |
| Label     | Media type                  |
| Name      | mediaType                   |
| Required  | true                        |
| Type      | select                      |
| Values    | [“audio”, “video”, “image”] |
| Default   | ""                          |

### Media types validation

| Type     | Value             | Message                       |
| :------- | :---------------- | :---------------------------- |
| if unset | null or undefined | "Please select a media type." |

### Year start field

| Attribute | Value      |
| :-------- | :--------- |
| Label     | Year start |
| Name      | yearStart  |
| Required  | false      |
| Type      | text       |
| Default   | ""         |

### Year start validation

| Type        | Value                  | Message                                 |
| :---------- | :--------------------- | :-------------------------------------- |
| number type | any non digit charater | "Please enter a valid number."          |
| min         | 1900                   | "Year start must be after 1900."        |
| max         | current year           | "Year start must not be in the future." |

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view your application.

The page auto-updates as you edit the files.

## Testing

To test your code run:

```bash
npm run test:debug
```

This will open up a browser window to show you your test in action
The page will auto-update as you edit files.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Features implemented during technical exercise

- Form with 3 fields built using React Hook Form, with Zod validation schema in line with specification above;
- Data fetched from Nasa API and displayed, initially limited to 10 items and later paginated. This includes related media assets fetched using NASA IDs returned by the original query;
- Pagination (including paginated data fetching from NASA API);
- Basic loading states for form submission and API fetch requests;
- Error handling: globally for form submission, and for API queries. Includes error messaging in UI and logging while in development environment.

## Challenges faced and solutions
Below I note some of the challenges I faced during development, along with how I approached and resolved each:
- **Handling complex data structures**: NASA's API returns nested arrays, with key data stored at varying depths. To manage this effectively, I made use of TypeScript for strong typing, and methods like `flatMap()` to simplify the structure and reduce unnecessary iteration.
- **Fixing Zod validation for yearStart**: The yearStart field needed to allow empty strings while applying validation for any entered numeric values. I achieved this using a z.union validator that handles both coerced numbers and empty strings:
```typescript
yearStart: z.union([
    z.coerce
      .number()
      .int({ message: "Please enter a valid number." })
      .gte(1900, { message: "Year start must be after 1900." })
      .lte(new Date().getFullYear(), {
        message: "Year start must not be in the future.",
      }),
    z.string().refine((value) => value === "", {
      message: "Please enter a valid number.",
    }),
  ]),
```
- **Async / rendering issues**: Ensuring that video data displayed correctly - I found that the results display would render before the video's URL could be passed through from the API response to the component. I therefore needed to add a check (and loading fallback) in case no media data had been passed through yet. I abstracted this into a separate `renderMedia()` function to keep this cleaner and more modular.
- **Pagination**: This required a consideration of different data fetching approaches - one option being to fetch all data related to the query and then splitting the result, and another option being to fetch a smaller, paginated subset of data on selecting each page. I opted for the latter, only requesting the amount of data required per page, which I considered would be more efficient and performant. This option was also available via the NASA API's query fields, though I understand Tanstack Query also offers pagination which I would be keen to explore further.

## Future enhancements
During development I noted a number of ways the app could be improved or developed further with additional features, given more time. These include:
- User could **multi-select** media types (NASA docs state this can be achieved in API request by separating multiple values with commas);
- **Pagination**: currently hard-limited to 100 items in total, but would be ideal to add a correct number of pages depending on the total number of items. This would involve either fetching all items and splitting the data, or using e.g. Tanstack Query's pagination functionality;
- **Image fetching**: Instead of fetching the first media item for an item at index 0, the app could use filtering logic to fetch a medium or smaller-sized asset depending on screen size;
- **Clean code improvements**: Ideally I would separate API queries into separate functions, keeping a separation of concerns between data fetching and display components;
- **Error handling**: Given more time I would potentially add reusable error logging middleware to keep error-handling/logging/messaging consistent. I would also add React Error Boundaries;
- **Data display**: Converting HTML tags returned within in each item's 'description' field into React components such as clickable links (without `dangerouslySetInnerHTML`). Options include react-html-parser library.
- **Loading states**: Suspense / loading states for media, with lazy loading and 'skeleton' UI fallback elements;
- **Accessibility**: Fetching captions for video assets (available via separate API query), truncated/expandable transcripts for audio;
- **Testing**: Use Playwright to mock API calls, simulate user interactions and verify proper data rendering.
