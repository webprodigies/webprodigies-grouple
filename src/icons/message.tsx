export const Message = ({ ...props }) => {
  return (
    <svg
      width="31"
      height="31"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V16C22 17.6569 20.6569 19 19 19H8L5.28037 21.2664C3.97771 22.3519 2 21.4256 2 19.7299V6Z"
        fill="#333337"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7 9C7 8.44772 7.44772 8 8 8H16C16.5523 8 17 8.44772 17 9C17 9.55228 16.5523 10 16 10H8C7.44772 10 7 9.55228 7 9Z"
        fill="#7A7775"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M7 13C7 12.4477 7.44772 12 8 12H12C12.5523 12 13 12.4477 13 13C13 13.5523 12.5523 14 12 14H8C7.44772 14 7 13.5523 7 13Z"
        fill="#7A7775"
      />
    </svg>
  )
}
