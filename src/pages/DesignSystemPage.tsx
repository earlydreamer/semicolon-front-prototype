import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import Search from 'lucide-react/dist/esm/icons/search';

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Inputs</h2>
        <div className="grid max-w-md gap-4">
          <Input label="Email" placeholder="example@email.com" />
          <Input label="With Icon" leftIcon={<Search className="h-4 w-4" />} />
          <Input label="Error State" error="Invalid email address" />
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Cards</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <h3 className="font-bold">Elevated Card</h3>
            <p className="text-neutral-600">Default card style</p>
          </Card>
          <Card variant="outlined" className="p-6">
            <h3 className="font-bold">Outlined Card</h3>
            <p className="text-neutral-600">Bordered style</p>
          </Card>
          <Card variant="filled" className="p-6" interactive>
            <h3 className="font-bold">Interactive Card</h3>
            <p className="text-neutral-600">Click me!</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
