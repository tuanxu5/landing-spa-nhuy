'use client';

import { Input, Button, Card, Badge } from '@/components/ui';

export default function TestColorsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Test Primary Colors</h1>

        {/* Color Palette */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold mb-4">Primary Color Palette</h2>
          <div className="grid grid-cols-5 gap-4">
            <div>
              <div className="h-20 bg-primary-50 rounded-lg mb-2"></div>
              <p className="text-xs">primary-50</p>
            </div>
            <div>
              <div className="h-20 bg-primary-100 rounded-lg mb-2"></div>
              <p className="text-xs">primary-100</p>
            </div>
            <div>
              <div className="h-20 bg-primary-200 rounded-lg mb-2"></div>
              <p className="text-xs">primary-200</p>
            </div>
            <div>
              <div className="h-20 bg-primary-300 rounded-lg mb-2"></div>
              <p className="text-xs">primary-300</p>
            </div>
            <div>
              <div className="h-20 bg-primary-400 rounded-lg mb-2"></div>
              <p className="text-xs">primary-400</p>
            </div>
            <div>
              <div className="h-20 bg-primary-500 rounded-lg mb-2"></div>
              <p className="text-xs">primary-500</p>
            </div>
            <div>
              <div className="h-20 bg-primary-600 rounded-lg mb-2"></div>
              <p className="text-xs">primary-600</p>
            </div>
            <div>
              <div className="h-20 bg-primary-700 rounded-lg mb-2"></div>
              <p className="text-xs">primary-700</p>
            </div>
            <div>
              <div className="h-20 bg-primary-800 rounded-lg mb-2"></div>
              <p className="text-xs">primary-800</p>
            </div>
            <div>
              <div className="h-20 bg-primary-900 rounded-lg mb-2"></div>
              <p className="text-xs">primary-900</p>
            </div>
          </div>
        </Card>

        {/* Buttons */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
          </div>
        </Card>

        {/* Inputs */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold mb-4">Inputs</h2>
          <div className="space-y-4">
            <Input
              label="Default Input"
              placeholder="Type something..."
              variant="default"
            />
            <Input
              label="Filled Input"
              placeholder="Type something..."
              variant="filled"
            />
          </div>
        </Card>

        {/* Badges */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold mb-4">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
            <Badge variant="gray">Gray</Badge>
          </div>
        </Card>

        {/* Text Colors */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold mb-4">Text Colors</h2>
          <div className="space-y-2">
            <p className="text-primary-500">This is primary-500 text</p>
            <p className="text-primary-600">This is primary-600 text</p>
            <p className="text-primary-700">This is primary-700 text</p>
          </div>
        </Card>

        {/* Border Colors */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-xl font-bold mb-4">Border Colors</h2>
          <div className="space-y-4">
            <div className="p-4 border-2 border-primary-500 rounded-lg">
              Border primary-500
            </div>
            <div className="p-4 border-2 border-primary-600 rounded-lg">
              Border primary-600
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
