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

//@ts-ignore
global.setImmediate = setTimeout;
//@ts-ignore
global.clearImmediate = clearTimeout;
//@ts-ignore
global.performance = {
  now() {
    if (global.android) {
      return java.lang.System.nanoTime() / 1000000;
    } else {
      return CACurrentMediaTime() * 1000;
    }
  },
};
global.process = {
  //@ts-ignore
  versions: {
    node: "10.0",
  },
};

function benchmark(
  root: any,
  Container: any,
  containerProps: any,
  Child: any,
  childProps: any
) {
  return new Promise((resolve, reject) => {
    const MARKER = `Rendering 1000 ${Child.name} in ${Container.name} took`;
    const container = new Container();
    root.content = container;
    //@ts-ignore
    for (const prop in containerProps) {
      container[prop] = containerProps[prop];
    }
    setTimeout(() => {
      console.time(MARKER);
      for (let i = 0; i < 1000; i++) {
        const view = new Child();
        for (const prop in childProps) {
          view[prop] = childProps[prop];
        }
        container.addChild(view);
      }
      console.timeEnd(MARKER);
      resolve(true);
    }, 1000);
  });
}

function benchmarkProp(
  root: any,
  Container: any,
  containerProps: any,
  Child: any,
  childProps: any,
  benchmarkProp: { [name: string]: any }
) {
  return new Promise((resolve, reject) => {
    const container = new Container();
    root.content = container;
    //@ts-ignore
    for (const prop in containerProps) {
      container[prop] = containerProps[prop];
    }
    setTimeout(() => {
      const views = [];
      for (let i = 0; i < 1000; i++) {
        const view = new Child();
        for (const prop in childProps) {
          view[prop] = childProps[prop];
        }
        (container as FlexboxLayout).addChild(view);
        views.push(view);
      }
      for (let prop in benchmarkProp) {
        const MARKER = `Setting ${prop} on ${Child.name} took`;
        console.time(MARKER);
        for (let view of views) {
          view[prop] = benchmarkProp[prop];
        }
        console.timeEnd(MARKER);
      }
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

    setTimeout(async () => {
      await benchmark(
        root,
        StackLayout,
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
      await benchmarkProp(
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
        },
        {
          backgroundColor: "red",
        }
      );
    });

    return root;
  },
});

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
