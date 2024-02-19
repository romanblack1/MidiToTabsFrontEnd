
import { Formik, Field, Form } from 'formik';

export default function LoginForm() {
    return (
        <Formik
            initialValues={{
                username: '',
                password: '',
            }}

            onSubmit={(values, actions) => {
                console.log({ values, actions });
                alert(JSON.stringify(values, null, 2) + "\n\nLogin Failed");
                actions.setSubmitting(false);
            }}
        >
            <Form className="flex flex-col">
                <Field className="text-2xl font-semibold mb-6 dark:bg-slate-500" id="username" name="username" placeholder="Username" />
                <Field className="text-2xl font-semibold mb-4 dark:bg-slate-500" type="password" id="password" name="password" placeholder="Password" />
                <button className="text-2xl font-bold dark:text-slate-500" type="submit">Submit</button>
            </Form>
        </Formik>
    )
}