import { Formik, Field, Form } from "formik";
import Link from "next/link";


export default function RegisterCard() {
  return (
    <div className="group rounded-lg bg-gray-300 px-5 py-4 transition-colors flex flex-col justify-center items-center dark:bg-slate-600">
      <h1 className="font-bold text-3xl mb-7 dark:bg-slate-600">Register</h1>

      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, actions) => {
          console.log({ values, actions });
          const loginFormData = new FormData();
          loginFormData.append("username", values.username)
          loginFormData.append("password", values.password)
          //api call
          const res = await fetch("http://localhost:3000/api/register", {
            method: "POST",
            body: loginFormData,
          });
          alert(await res.text());
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
          <Link
            className="mr-auto text-black text-2xl font-semibold dark:text-slate-200"
            href="/login"
          >
            Login
          </Link>
        </Form>
      </Formik>
    </div>
  );
}