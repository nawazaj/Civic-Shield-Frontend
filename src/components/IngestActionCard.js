import React, { useState } from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const TAG_VARIANT = { LIVE: 'live', SIMULATED: 'simulated', PROCESS: 'process' };

export default function IngestActionCard({ title, tag, fields = [], onRun, note, delay = 0 }) {
  const [values, setValues] = useState(
    Object.fromEntries(fields.map((f) => [f.name, f.defaultValue]))
  );
  const [busy, setBusy] = useState(false);

  const update = (name, val) => setValues((v) => ({ ...v, [name]: val }));

  const handleRun = async () => {
    setBusy(true);
    try {
      await onRun(values);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(400).springify().damping(18)}>
      <Card className="p-3.5 mb-3">
        <View className="flex-row items-center justify-between mb-2.5">
          <Text className="text-hi text-[15px] font-bold">{title}</Text>
          {tag ? <Badge variant={TAG_VARIANT[tag] || 'default'} dot>{tag}</Badge> : null}
        </View>

        {fields.length > 0 && (
          <View className="flex-row gap-2 mb-2.5">
            {fields.map((f) => (
              <Input
                key={f.name}
                placeholder={f.placeholder}
                value={values[f.name] ?? ''}
                onChangeText={(t) => update(f.name, t)}
                className="flex-1"
              />
            ))}
          </View>
        )}

        <Button onPress={handleRun} loading={busy} size="sm" className="self-start px-5">
          Run
        </Button>

        {note ? <Text className="text-low text-[11.5px] leading-4 mt-2.5">{note}</Text> : null}
      </Card>
    </Animated.View>
  );
}
