import { FormikProps } from 'formik';
import * as Yup from 'yup';

export async function validateStepFields<TValues extends Record<string, unknown>>(
  formik: FormikProps<TValues>,
  schema: Yup.AnyObjectSchema,
  fields: string[],
): Promise<boolean> {
  const touched: Record<string, boolean> = {};
  fields.forEach((field) => {
    touched[field] = true;
  });

  formik.setTouched({ ...(formik.touched as Record<string, boolean>), ...touched } as any, false);

  const stepValues: Record<string, unknown> = {};
  fields.forEach((field) => {
    stepValues[field] = formik.values[field as keyof TValues];
  });

  const schemaFields = (schema as Yup.AnyObjectSchema).fields as Record<string, Yup.AnySchema>;

  const stepSchemaShape: Record<string, Yup.AnySchema> = {};
  fields.forEach((field) => {
    const fieldSchema = schemaFields[field];
    if (fieldSchema) {
      stepSchemaShape[field] = fieldSchema;
    }
  });

  try {
    await Yup.object().shape(stepSchemaShape).validate(stepValues, { abortEarly: false });
    return true;
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const fieldErrors: Record<string, string> = {};
      error.inner.forEach((inner) => {
        if (inner.path && !fieldErrors[inner.path]) {
          fieldErrors[inner.path] = inner.message;
        }
      });
      formik.setErrors({ ...formik.errors, ...fieldErrors });
    }
    return false;
  }
}
