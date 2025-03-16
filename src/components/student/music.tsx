import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MUSIC_CONTENT from "../../../music.json";
import { useAudio } from "@/hooks/use-audio";
import { Pause, Play } from "lucide-react";

export function Music() {
  const [playing, isAudioSet, toggle, updateAudio] = useAudio();

  const handleSelectChange = (value: string) => {
    const selectedAudio = MUSIC_CONTENT.flatMap((content) =>
      content.audio.filter((audio) => audio.audioName === value)
    )[0];
    updateAudio(selectedAudio.audioPath);
  };

  return (
    <div className="flex items-center">
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="max-w-[500px] max-h-[100px]  font-bold  text-[30px] p-[30px]">
          <SelectValue className=" font-bold " placeholder="Select Music" />
        </SelectTrigger>
        <SelectContent>
          {MUSIC_CONTENT.map((content) => (
            <SelectGroup key={content.id}>
              <SelectLabel>{content.category}</SelectLabel>
              {content.audio.map((audio) => (
                <SelectItem key={audio.audioName} value={audio.audioName}>
                  {audio.audioName}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
      {isAudioSet && (
        <div className="focus:outline-none" onClick={toggle}>
          {playing ? (
            <Pause size={50} className="cursor-pointer" />
          ) : (
            <Play size={50} className="cursor-pointer" />
          )}
        </div>
      )}
    </div>
  );
}
