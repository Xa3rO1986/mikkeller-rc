import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Timer, Ruler, Zap } from "lucide-react";

export default function PaceCalculator() {
  const [activeTab, setActiveTab] = useState("pace");
  const [distanceKm, setDistanceKm] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [paceMin, setPaceMin] = useState("");
  const [paceSec, setPaceSec] = useState("");

  const [result, setResult] = useState<{
    pace?: string;
    speed?: string;
    time?: string;
    distance?: string;
  }>({});

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setResult({});
  };

  const calculatePaceFromDistanceTime = () => {
    const dist = parseFloat(distanceKm);
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;

    if (!dist || dist <= 0) {
      alert("Введите корректную дистанцию");
      return;
    }

    const totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds <= 0) {
      alert("Введите корректное время");
      return;
    }

    const paceSecondsPerKm = totalSeconds / dist;
    let paceMinutes = Math.floor(paceSecondsPerKm / 60);
    let paceSeconds = Math.round(paceSecondsPerKm % 60);
    
    if (paceSeconds >= 60) {
      paceMinutes += 1;
      paceSeconds = 0;
    }
    
    const speedKmh = (dist / totalSeconds) * 3600;

    setResult({
      pace: `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')} мин/км`,
      speed: `${speedKmh.toFixed(2)} км/ч`,
    });
  };

  const calculateTimeFromDistancePace = () => {
    const dist = parseFloat(distanceKm);
    const paceM = parseInt(paceMin) || 0;
    const paceS = parseInt(paceSec) || 0;

    if (!dist || dist <= 0) {
      alert("Введите корректную дистанцию");
      return;
    }

    if (paceM <= 0 && paceS <= 0) {
      alert("Введите корректный темп");
      return;
    }

    const paceSecondsPerKm = paceM * 60 + paceS;
    const totalSeconds = paceSecondsPerKm * dist;
    
    let h = Math.floor(totalSeconds / 3600);
    let m = Math.floor((totalSeconds % 3600) / 60);
    let s = Math.round(totalSeconds % 60);

    if (s >= 60) {
      m += 1;
      s = 0;
    }
    if (m >= 60) {
      h += 1;
      m = 0;
    }

    const speedKmh = (dist / totalSeconds) * 3600;

    setResult({
      time: `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
      speed: `${speedKmh.toFixed(2)} км/ч`,
    });
  };

  const calculateDistanceFromTimePace = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const paceM = parseInt(paceMin) || 0;
    const paceS = parseInt(paceSec) || 0;

    const totalSeconds = h * 3600 + m * 60 + s;
    if (totalSeconds <= 0) {
      alert("Введите корректное время");
      return;
    }

    const paceSecondsPerKm = paceM * 60 + paceS;
    if (paceSecondsPerKm <= 0) {
      alert("Введите корректный темп");
      return;
    }

    const dist = totalSeconds / paceSecondsPerKm;
    const speedKmh = (dist / totalSeconds) * 3600;

    setResult({
      distance: `${dist.toFixed(2)} км`,
      speed: `${speedKmh.toFixed(2)} км/ч`,
    });
  };

  const resetForm = () => {
    setDistanceKm("");
    setHours("");
    setMinutes("");
    setSeconds("");
    setPaceMin("");
    setPaceSec("");
    setResult({});
  };

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-12 w-12" />
            <h1 className="text-4xl lg:text-5xl font-bold" data-testid="text-page-title">
              Калькулятор темпа
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Рассчитайте темп бега, время финиша или необходимую дистанцию
          </p>
        </div>

        <Tabs defaultValue="pace" className="w-full" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3 mb-8" data-testid="tabs-calculator-mode">
            <TabsTrigger value="pace" data-testid="tab-calculate-pace">
              <Timer className="h-4 w-4 mr-2" />
              Темп
            </TabsTrigger>
            <TabsTrigger value="time" data-testid="tab-calculate-time">
              <Zap className="h-4 w-4 mr-2" />
              Время
            </TabsTrigger>
            <TabsTrigger value="distance" data-testid="tab-calculate-distance">
              <Ruler className="h-4 w-4 mr-2" />
              Дистанция
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pace">
            <Card>
              <CardHeader>
                <CardTitle>Рассчитать темп</CardTitle>
                <CardDescription>
                  Введите дистанцию и время, чтобы узнать ваш темп
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="distance-pace">Дистанция (км)</Label>
                  <Input
                    id="distance-pace"
                    type="number"
                    step="0.01"
                    placeholder="5.0"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    data-testid="input-pace-distance"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Время</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="hours-pace" className="text-xs text-muted-foreground">Часы</Label>
                      <Input
                        id="hours-pace"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        data-testid="input-pace-hours"
                      />
                    </div>
                    <div>
                      <Label htmlFor="minutes-pace" className="text-xs text-muted-foreground">Минуты</Label>
                      <Input
                        id="minutes-pace"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="25"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        data-testid="input-pace-minutes"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seconds-pace" className="text-xs text-muted-foreground">Секунды</Label>
                      <Input
                        id="seconds-pace"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="30"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                        data-testid="input-pace-seconds"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={calculatePaceFromDistanceTime} 
                    className="flex-1"
                    data-testid="button-pace-calculate"
                  >
                    Рассчитать
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    data-testid="button-pace-reset"
                  >
                    Сбросить
                  </Button>
                </div>

                {(result.pace || result.speed) && (
                  <div className="mt-6 p-6 bg-muted rounded-lg space-y-3" data-testid="result-pace-display">
                    {result.pace && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Темп:</span>
                        <span className="text-2xl font-bold" data-testid="text-pace-result-pace">{result.pace}</span>
                      </div>
                    )}
                    {result.speed && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Скорость:</span>
                        <span className="text-xl font-semibold" data-testid="text-pace-result-speed">{result.speed}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="time">
            <Card>
              <CardHeader>
                <CardTitle>Рассчитать время финиша</CardTitle>
                <CardDescription>
                  Введите дистанцию и желаемый темп, чтобы узнать время финиша
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="distance-time">Дистанция (км)</Label>
                  <Input
                    id="distance-time"
                    type="number"
                    step="0.01"
                    placeholder="10.0"
                    value={distanceKm}
                    onChange={(e) => setDistanceKm(e.target.value)}
                    data-testid="input-time-distance"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Темп (мин/км)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="pace-min-time" className="text-xs text-muted-foreground">Минуты</Label>
                      <Input
                        id="pace-min-time"
                        type="number"
                        min="0"
                        placeholder="5"
                        value={paceMin}
                        onChange={(e) => setPaceMin(e.target.value)}
                        data-testid="input-time-pace-minutes"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pace-sec-time" className="text-xs text-muted-foreground">Секунды</Label>
                      <Input
                        id="pace-sec-time"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="30"
                        value={paceSec}
                        onChange={(e) => setPaceSec(e.target.value)}
                        data-testid="input-time-pace-seconds"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={calculateTimeFromDistancePace} 
                    className="flex-1"
                    data-testid="button-time-calculate"
                  >
                    Рассчитать
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    data-testid="button-time-reset"
                  >
                    Сбросить
                  </Button>
                </div>

                {(result.time || result.speed) && (
                  <div className="mt-6 p-6 bg-muted rounded-lg space-y-3" data-testid="result-time-display">
                    {result.time && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Время финиша:</span>
                        <span className="text-2xl font-bold" data-testid="text-time-result-time">{result.time}</span>
                      </div>
                    )}
                    {result.speed && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Скорость:</span>
                        <span className="text-xl font-semibold" data-testid="text-time-result-speed">{result.speed}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distance">
            <Card>
              <CardHeader>
                <CardTitle>Рассчитать дистанцию</CardTitle>
                <CardDescription>
                  Введите время и темп, чтобы узнать пройденную дистанцию
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Время</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="hours-dist" className="text-xs text-muted-foreground">Часы</Label>
                      <Input
                        id="hours-dist"
                        type="number"
                        min="0"
                        placeholder="1"
                        value={hours}
                        onChange={(e) => setHours(e.target.value)}
                        data-testid="input-distance-hours"
                      />
                    </div>
                    <div>
                      <Label htmlFor="minutes-dist" className="text-xs text-muted-foreground">Минуты</Label>
                      <Input
                        id="minutes-dist"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={minutes}
                        onChange={(e) => setMinutes(e.target.value)}
                        data-testid="input-distance-minutes"
                      />
                    </div>
                    <div>
                      <Label htmlFor="seconds-dist" className="text-xs text-muted-foreground">Секунды</Label>
                      <Input
                        id="seconds-dist"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={seconds}
                        onChange={(e) => setSeconds(e.target.value)}
                        data-testid="input-distance-seconds"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Темп (мин/км)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="pace-min-dist" className="text-xs text-muted-foreground">Минуты</Label>
                      <Input
                        id="pace-min-dist"
                        type="number"
                        min="0"
                        placeholder="5"
                        value={paceMin}
                        onChange={(e) => setPaceMin(e.target.value)}
                        data-testid="input-distance-pace-minutes"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pace-sec-dist" className="text-xs text-muted-foreground">Секунды</Label>
                      <Input
                        id="pace-sec-dist"
                        type="number"
                        min="0"
                        max="59"
                        placeholder="0"
                        value={paceSec}
                        onChange={(e) => setPaceSec(e.target.value)}
                        data-testid="input-distance-pace-seconds"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={calculateDistanceFromTimePace} 
                    className="flex-1"
                    data-testid="button-distance-calculate"
                  >
                    Рассчитать
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    data-testid="button-distance-reset"
                  >
                    Сбросить
                  </Button>
                </div>

                {(result.distance || result.speed) && (
                  <div className="mt-6 p-6 bg-muted rounded-lg space-y-3" data-testid="result-distance-display">
                    {result.distance && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Дистанция:</span>
                        <span className="text-2xl font-bold" data-testid="text-distance-result-distance">{result.distance}</span>
                      </div>
                    )}
                    {result.speed && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Скорость:</span>
                        <span className="text-xl font-semibold" data-testid="text-distance-result-speed">{result.speed}</span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Популярные дистанции</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: '5 км', distance: '5' },
                { name: '10 км', distance: '10' },
                { name: 'Полумарафон', distance: '21.0975' },
                { name: 'Марафон', distance: '42.195' },
              ].map((preset) => (
                <Button
                  key={preset.distance}
                  variant="outline"
                  onClick={() => setDistanceKm(preset.distance)}
                  className="h-auto py-4"
                  data-testid={`button-preset-${preset.distance}`}
                >
                  <div className="text-center">
                    <div className="font-bold">{preset.name}</div>
                    <div className="text-xs text-muted-foreground">{preset.distance} км</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
