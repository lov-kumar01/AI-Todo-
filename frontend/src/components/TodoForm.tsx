import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateTodoInput,
  createTodoSchema
} from "../schemas/todoSchemas";

interface Props {
  onSubmit: (data: CreateTodoInput) => void;
  isLoading?: boolean;
}

export const TodoForm = ({ onSubmit, isLoading }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateTodoInput>({
    resolver: zodResolver(createTodoSchema)
  });

  const handleCreate = (data: CreateTodoInput) => {
    onSubmit(data);
    reset(); // Clear form
  };

  return (
    <form
      onSubmit={handleSubmit(handleCreate)}
      className="flex flex-col sm:flex-row gap-2 mb-4"
    >
      <div className="flex-1">
        <input
          type="text"
          placeholder="Todo title..."
          {...register("title")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="flex-1">
        <input
          type="text"
          placeholder="Description (optional)"
          {...register("description")}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {isLoading ? "Adding..." : "Add Todo"}
      </button>
    </form>
  );
};
