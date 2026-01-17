# Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

## Creating a Changeset

When you make changes that should be included in a release:

```bash
pnpm changeset
```

This will prompt you to:

1. Select which packages are affected
2. Choose the type of change (major, minor, patch)
3. Write a description of the change

## Versioning

To bump package versions based on changesets:

```bash
pnpm changeset:version
```

This will:

- Update package versions
- Generate CHANGELOG.md entries
- Remove used changeset files

## Releasing

To publish packages (when ready):

```bash
pnpm changeset:release
```

## Workflow

1. Make your changes
2. Run `pnpm changeset` to create a changeset
3. Commit your changes and the changeset file
4. When ready to release, run `pnpm changeset:version` to bump versions
5. Commit the version bumps and changelog updates
6. Tag the release
7. Run `pnpm changeset:release` to publish
