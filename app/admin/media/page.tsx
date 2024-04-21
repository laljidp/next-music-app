import TWInput from "@/components/UI/Input";
import { SearchOutlined } from "@ant-design/icons";

export default function MediaPage() {
  return (
    <div>
      <TWInput
        placeholder="Search media"
        name="search"
        icon={<SearchOutlined className="text-slate-400" />}
      />
      <div className="p-2">No Media found.</div>
    </div>
  );
}
