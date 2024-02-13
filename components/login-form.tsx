
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
            <Form>
                <Field id="username" name="username" placeholder="Username" />
                <Field type="password" id="password" name="password" placeholder="Password" />
                <button type="submit">Submit</button>
            </Form>
        </Formik>
    )
}