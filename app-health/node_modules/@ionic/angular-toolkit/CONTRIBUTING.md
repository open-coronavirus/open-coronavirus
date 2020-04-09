# Contributing

:mega: **Support/Questions?**: Please see our [Support
Page](https://ionicframework.com/support) for general support questions. The
issues on GitHub should be reserved for bug reports and feature requests.

### Local Setup

1. Fork the repo & clone it locally.
1. `npm install`
1. `npm run build` to build source files

#### Warning: `npm link` may not work

Using symlinks for Angular tooling may lead to issues. To test changes in a real project, copy the library to `node_modules/@ionic/angular-toolkit`. For example, using `rsync`:

```
rsync -avuP --exclude .git --exclude node_modules /path/to/git/angular-toolkit node_modules/@ionic
```

### Publishing

CI automatically publishes the next version semantically from analyzing commits in `stable`. To maintain a shared history between `master` and `stable`, the branches must be rebased with each other locally.

* When it's time to cut a release from `master`:

    ```
    git checkout stable
    git rebase master
    git push origin stable
    ```

* Await successful publish in CI. Ionitron will push the updated versions and tags to `stable`.
* Sync `master` with `stable`.

  ```
  git pull origin stable
  git checkout master
  git rebase stable
  git push origin master
  ```
