# Contributing to Zoonk

Zoonk encourages a diverse, inclusive community. Before contributing to Zoonk, make sure you read our [Code of Conduct](./CODE_OF_CONDUCT.md).

There are a few ways you can contribute to Zoonk:

## Reporting bugs

Did you find something that's not working properly? Then, [open a bug report](https://github.com/zoonk/web/issues/new?labels=bug&template=bug_report.md).

## Suggesting new features

Would you like to see a new feature available on Zoonk? Then, [open a feature request](https://github.com/zoonk/web/issues/new?labels=enhancement&template=feature_request.md).

## Starting a conversation

Do you have any ideas about the project you would like to discuss? Then, [open an issue](https://github.com/zoonk/web/issues/new) to discuss it. You can also contribute to [other areas of Zoonk](https://en.zoonk.org/posts/how-can-i-contribute-to-zoonk-tmjf1m4wo) (e.g. culture, design, content, etc.).

## Writing code

[Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account. Then, [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.

### Installing Zoonk locally

1. Create a new branch `git checkout -b MY_BRANCH_NAME`
1. Install yarn: `npm install -g yarn`
1. Install the dependencies: `yarn install:deps`
1. Deploy Firebase: `yarn`
1. Run `yarn dev` to build and watch for code changes

### Running tests

- Run `yarn test:watch` to run tests and watch for file changes
- Run `yarn test` to run tests only once
- Run `yarn test:coverage` to get the test coverage

### Linting

- Run `yarn lint` for linting all files

### Type-checking

- Run `yarn tsc` for type-checking all files
- Run `yarn tsc:app` for type-checking the frontend only
- Run `yarn tsc:functions` for type-checking the backend only

### Setting up Firebase

We're using [Firebase](https://firebase.google.com) for our backend (authentication, database, storage, analytics). We have a development project configured for you to get started more quickly. However, we recommend you to [create your own Firebase project](https://firebase.google.com/docs/web/setup) to get started. It will be easier for making changes (e.g. deploying new Firestore rules or Cloud Functions).

After you do so, Firebase will give you a [config object](https://firebase.google.com/docs/web/setup#config-object). You'll need to add those values to your environment variables. You can create an `.env.local` file on the app's root directory. You need to pass the following environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DB_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

You'll also need to update the `.firebaserc` file to match the project ID you've created. Edit that file to have the following:

```json
{
  "projects": {
    "default": "your-firebase-app-id"
  }
}
```

Replace `your-firebase-app-id` with the `projectId` value you got from your config object.

### Setting up Algolia

We're using [Algolia](https://www.algolia.com/) for our search. Before you get started, we recommend you to [create a free Algolia account](https://www.algolia.com/users/sign_up). They'll guide you on creating your first project. After you do so, you'll need to add Algolia's API keys to your environment variables (the `.env.local` you've created in the previous step).

You need to create two environment variables:

```
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=
```

You can get them from the Algolia dashboard:

1. Select your test project
1. Go to "API Keys"
1. Copy the value from "Application ID" and "Search-Only API Key" and paste them on the environment variables you've created above

### Other environment variables

You can also use the following environment variables on your `.env.local` file:

| Name                    | Type       | Default   |
| ----------------------- | ---------- | --------- |
| `NEXT_PUBLIC_APP_LANG`  | `en`, `pt` | `en`      |
| `NEXT_PUBLIC_BUILD_ENV` | `string`   | `staging` |
