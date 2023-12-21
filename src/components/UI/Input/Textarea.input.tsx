interface TWTextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {}

export default function TWTextArea({ label, ...restProps }: TWTextAreaProps) {
  const elemId = `txt-area-${restProps.name}`;
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium" htmlFor={elemId}>
          {label}
        </label>
      )}
      <textarea
        id={elemId}
        className="tw-input"
        cols={3}
        rows={2}
        {...restProps}
      />
    </div>
  );
}
