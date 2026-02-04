import { Logo } from './logo';

export function Header() {
  return (
    <header className="py-4 px-4 md:px-6 border-b bg-card">
      <div className="container mx-auto flex items-center gap-4">
        <Logo />
        <h1 className="text-xl md:text-2xl font-bold font-headline text-primary tracking-tight">
          Focus Habit Launcher
        </h1>
      </div>
    </header>
  );
}
