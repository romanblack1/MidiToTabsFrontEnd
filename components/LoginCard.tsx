import { Formik, Field, Form } from "formik";
import Link from "next/link";
import Image from "next/image";
import "./LoginRegisterCard.css";

export default function LoginCard() {
  return (
    <div className="group rounded-lg bg-gray-300 px-5 py-4 transition-colors flex flex-col justify-center items-center dark:bg-slate-600 relative">
      <h1 className="font-bold text-3xl mb-7">Login</h1>
      <div className="return-home">
        <Link href="/">
          <Image
            src="/back_icon.png"
            alt="back"
            width={40}
            height={40}
            priority
          />
        </Link>
      </div>

      <Formik
        initialValues={{
          username: "",
          password: "",
        }}
        onSubmit={async (values, actions) => {
          const loginFormData = new FormData();
          loginFormData.append("username", values.username);
          loginFormData.append("password", values.password);
          //api call
          const res = await fetch("/api/login", {
            method: "POST",
            body: loginFormData,
          });
          const data = await res.json(); // Parse the JSON response
          alert(data.message); // Alert the message from the response

          if (res.status === 200) {
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("username", values.username);
            window.location.reload();
          }

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
          <button className="text-2xl font-bold" type="submit">
            Submit
          </button>
          <Link
            className="mr-auto text-black text-2xl font-semibold dark:text-slate-500"
            href="/register"
          >
            Register
          </Link>
        </Form>
      </Formik>
    </div>
  );
}
