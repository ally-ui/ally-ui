# Ally UI

An agnostic and accessible component library for all UI frameworks.

## What is an agnostic component library?

Building accessible components for the web is difficult. Ally UI handles all your accessibility concerns while supporting your UI library of choice (React, Svelte, Vue, Angular, etc.).

## Bring your own styles

Ally UI is 100% headless, thereby giving you full control over how your components are styled.

> No more using pre-styled components!

Now, you can create a seamless experience that matches your theme without sacrificing accessibility.

## SSR Compatible

Ally UI is designed to support server-side rendering for powerful SEO and hydration capabilities in UI libraries that support it.

## Why Ally UI?

### Amazing developer experience

The core of Ally UI is built with plain-old JavaScript and simple bindings are used to provide a great developer experience no matter what UI library you use.

<details>
<summary>React</summary>

```tsx
export default function App() {
  const dialog = useDialog();
  return (
    <main>
      <Dialog.Trigger model={dialog}>Edit profile</Dialog.Trigger>
      <Dialog.Content model={dialog}>
        <Dialog.Title model={dialog}>Edit profile</Dialog.Title>
        <Dialog.Description model={dialog}>
          Make changes to your profile here. Click save when you're done
        </Dialog.Description>
        <Dialog.Close model={dialog}>Save changes</Dialog.Close>
      </Dialog.Content>
    </main>
  );
}
```

</details>
<details>
<summary>Svelte</summary>

```svelte
<script>
  const dialog = createDialog();
</script>

<main>
  <Dialog.Trigger model={dialog}>Edit profile</Dialog.Trigger>
  <Dialog.Content model={dialog}>
    <Dialog.Title model={dialog}>Edit profile</Dialog.Title>
    <Dialog.Description model={dialog}>
      Make changes to your profile here. Click save when you're done
    </Dialog.Description>
    <Dialog.Close model={dialog}>Save changes</Dialog.Close>
  </Dialog.Content>
</main>
```

</details>

### Extensively tested

By building a single core implementation, we can maintain much less code. This ensures that you get a highly reliable and well-tested component system.

### Latest features, always

We also benefit from a consolidated developer community; we have more developers helping to discover bugs and discuss new improvements. Because features are shared the core implementation, you will always get the latest features and components whether you are using React or your own custom UI library!

# Contributing

Different UI libraries bring different challenges. If you are an enthusiast or expert of any UI library, we would love your help to guide the design of Ally UI.

<table>
  <thead>
    <tr>
      <th>UI</th>
      <th>Team</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <a href="https://reactjs.org/">
          <img alt="react" src="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_reactjs.svg" width="48px" />
        </a>
      </td>
      <td>
        <a href="https://github.com/bryanmylee">
          <img alt="bryanmylee" src="https://avatars.githubusercontent.com/u/42545742?v=latest" width="48px"/>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <a href="https://svelte.dev/">
          <img alt="svelte" src="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_svelte.svg" width="48px" />
        </a>
      </td>
      <td>
        <a href="https://github.com/bryanmylee">
          <img alt="bryanmylee" src="https://avatars.githubusercontent.com/u/42545742?v=latest" width="48px"/>
        </a>
      </td>
    </tr>
    <tr>
      <td>
        <a href="https://vuejs.org/">
          <img alt="vue" src="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_vue.svg" width="48px" />
        </a>
      </td>
      <td>
        We need contributors!
      </td>
    </tr>
    <tr>
      <td>
        <a href="https://angular.io/">
          <img alt="angular" src="https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/file_type_angular.svg" width="48px" />
        </a>
      </td>
      <td>
        We need contributors!
      </td>
    </tr>
    <tr>
      <td>
        <a href="https://www.solidjs.com/">
          <img alt="solid" src="https://www.solidjs.com/assets/logo.123b04bc.svg" width="48px" />
        </a>
      </td>
      <td>
        We need contributors!
      </td>
    </tr>
  </tbody>
</table>
