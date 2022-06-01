import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import {addComment} from "../../../helpers/backend_helper";
import PropTypes from "prop-types";
import BlogPostCommentList from "./BlogPostCommentList";

// ----------------------------------------------------------------------

const RootStyles = styled('div')(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------
BlogPostCommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};
export default function BlogPostCommentForm({ post }) {
  const CommentSchema = Yup.object().shape({
    comment: Yup.string().required('Comment is required'),
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const defaultValues = {
    comment: '',
    name: '',
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(CommentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitting, isValid },

  } = methods;

  const onSubmit = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const comment = getValues();
      comment.postId = post._id;
      comment.avatarUrl = "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/62.jpg"
      await addComment(comment);
      console.log("comments--",comment);
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <RootStyles>
      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Add Comment
      </Typography>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">
          <RHFTextField name="comment" label="Comment *" multiline rows={3} />

          <RHFTextField name="name" label="Name *" />

          <RHFTextField name="email" label="Email *" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Post comment
          </LoadingButton>
        </Stack>
      </FormProvider>
    </RootStyles>
  );
}
