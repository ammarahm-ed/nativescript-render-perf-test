/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import {
  Application,
  FlexboxLayout,
  ScrollView,
  StackLayout,
} from "@nativescript/core";

function benchmark(
  root: any,
  Container: any,
  containerProps: any,
  Child: any,
  childProps: any
) {
  return new Promise((resolve, reject) => {
    const container = new Container();
    root.content = container;
    //@ts-ignore
    for (const prop in containerProps) {
      container[prop] = containerProps[prop];
    }
    setTimeout(() => {
      console.log("Render test began");
      console.time("Render test result");
      for (let i = 0; i < 1000; i++) {
        const view = new Child();
        for (const prop in childProps) {
          view[prop] = childProps[prop];
        }
        container.addChild(view);
      }
      console.timeEnd("Render test result");
      console.log("Render test end");
      resolve(true);
    }, 1000);
  });
}

Application.run({
  create() {
    const root = new ScrollView();
    //@ts-ignore
    root.width = "100%";
    //@ts-ignore
    root.height = "100%";

    benchmark(
      root,
      FlexboxLayout,
      {
        width: "100%",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
      },
      StackLayout,
      {
        width: 100,
        height: 100,
        marginBottom: 10,
        backgroundColor: "red",
      }
    );

    return root;
  },
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
