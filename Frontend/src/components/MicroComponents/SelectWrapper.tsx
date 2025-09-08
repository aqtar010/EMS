import {
  Select,
  SelectLabel,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
type SelectTimezoneWrapperProps = {
  setTimeZone: (value: string) => void;
};
export default function SelectTimezoneWrapper({setTimeZone}:SelectTimezoneWrapperProps) {
  return (
    <Select onValueChange={(value) => setTimeZone(value)} defaultValue="Asia/Kolkata">
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        {/* Universal */}
        <SelectGroup>
          <SelectLabel>Universal</SelectLabel>
          <SelectItem value="UTC">UTC</SelectItem>
        </SelectGroup>

        {/* North America */}
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
          <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
          <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
          <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
          <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
          <SelectItem value="America/Honolulu">Hawaii Time (HST)</SelectItem>
        </SelectGroup>

        {/* Europe & Africa */}
        <SelectGroup>
          <SelectLabel>Europe & Africa</SelectLabel>
          <SelectItem value="Europe/London">
            Greenwich Mean Time (GMT)
          </SelectItem>
          <SelectItem value="Europe/Berlin">
            Central European Time (CET)
          </SelectItem>
          <SelectItem value="Europe/Athens">
            Eastern European Time (EET)
          </SelectItem>
          <SelectItem value="Europe/Madrid">
            Western European Summer (WEST)
          </SelectItem>
          <SelectItem value="Africa/Johannesburg">
            Central Africa Time (CAT)
          </SelectItem>
          <SelectItem value="Africa/Nairobi">East Africa Time (EAT)</SelectItem>
        </SelectGroup>

        {/* Asia */}
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          <SelectItem value="Europe/Moscow">Moscow Time (MSK)</SelectItem>
          <SelectItem value="Asia/Kolkata">
            India Standard Time (IST)
          </SelectItem>
          <SelectItem value="Asia/Shanghai">
            China Standard Time (CST)
          </SelectItem>
          <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
          <SelectItem value="Asia/Seoul">Korea Standard Time (KST)</SelectItem>
          <SelectItem value="Asia/Makassar">
            Indonesia Central Time (WITA)
          </SelectItem>
        </SelectGroup>

        {/* Australia & Pacific */}
        <SelectGroup>
          <SelectLabel>Australia & Pacific</SelectLabel>
          <SelectItem value="Australia/Perth">
            Australian Western (AWST)
          </SelectItem>
          <SelectItem value="Australia/Adelaide">
            Australian Central (ACST)
          </SelectItem>
          <SelectItem value="Australia/Sydney">
            Australian Eastern (AEST)
          </SelectItem>
          <SelectItem value="Pacific/Auckland">
            New Zealand Standard (NZST)
          </SelectItem>
          <SelectItem value="Pacific/Fiji">Fiji Time (FJT)</SelectItem>
        </SelectGroup>

        {/* South America */}
        <SelectGroup>
          <SelectLabel>South America</SelectLabel>
          <SelectItem value="America/Argentina/Buenos_Aires">
            Argentina Time (ART)
          </SelectItem>
          <SelectItem value="America/La_Paz">Bolivia Time (BOT)</SelectItem>
          <SelectItem value="America/Sao_Paulo">Brasilia Time (BRT)</SelectItem>
          <SelectItem value="America/Santiago">
            Chile Standard Time (CLT)
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
