import { Formik, Field, Form } from "formik";

export default function LoginCard() {
  return (
    <div className="group rounded-lg bg-gray-300 px-5 py-4 transition-colors flex flex-col justify-center items-center dark:bg-slate-600">
      <h1 className="font-bold text-3xl mb-7">Login</h1>

      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={(values, actions) => {
          console.log({ values, actions });
          alert(JSON.stringify(values, null, 2) + "\n\nLogin Failed");
          actions.setSubmitting(false);
        }}
      >
        <Form className="flex flex-col">
          <Field
            className="text-2xl font-semibold mb-6 dark:bg-slate-500"
            id="username"
            name="username"
            placeholder="Username"
          />
          <Field
            className="text-2xl font-semibold mb-4 dark:bg-slate-500"
            type="password"
            id="password"
            name="password"
            placeholder="Password"
          />
          <button
            className="text-2xl font-bold dark:text-slate-500"
            type="submit"
          >
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
}
