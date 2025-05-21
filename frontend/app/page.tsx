"use client";

import { useEffect, useState } from "react";
import { Baby } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function Home() {
  const [name, setName] = useState("");
  const [guess, setGuess] = useState("male");
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ male: 0, female: 0 });
  const [messages, setMessages] = useState<{ name?: string; message?: string, guess?: string }[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3001/api/guesses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, guess, message }),
    });

    if (response.ok) {
      const newStats = await response.json();
      setStats(newStats);
      setName("");
      setGuess("male");
      setMessage("");
    }
  };

  const getData = async () => {
    const response = await fetch("http://localhost:3001/api/guesses", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    console.log(response);
    if (response.ok) {
      const stats = await response.json();
      setStats(stats);
    }
  };

  const getMessages = async () => {
    const response = await fetch("http://localhost:3001/api/messages", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (response.ok) {
      const messages = await response.json();
      setMessages(messages);
    }
  };

  useEffect(() => {
    getData();
    getMessages();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Baby className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Baby Gender Reveal
          </h1>
          <p className="text-lg text-gray-600">
            Make your guess and be part of our special moment!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Your Guess</Label>
                <RadioGroup
                  value={guess}
                  onValueChange={setGuess}
                  className="mt-2 flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Boy 👶</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Girl 👶</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a message for the parents..."
                  className="mt-1"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600"
              >
                Submit Guess
              </Button>
            </form>
          </Card>

          <Card className="p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Current Guesses
            </h2>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-500 mb-2">
                  {stats.male}
                </div>
                <div className="text-lg text-gray-600">Guessed Boy</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-pink-500 mb-2">
                  {stats.female}
                </div>
                <div className="text-lg text-gray-600">Guessed Girl</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Messages
            </h2>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800 mb-2">
                  {messages.length} Messages
                </div>
                {/* make the message look like a card with best design */}
                <div className="bg-white shadow-md rounded-lg p-4">
                  {messages.map((msg, index) => (
                    <div key={index} className="mb-4 border-b pb-2 last:border-b-0">
                      <p className="text-gray-800 font-semibold">
                        <span>
                          {msg.name}
                        </span>
                        {`(${msg.guess})`}</p>
                      <p className="text-gray-600">{msg.message}</p>
                    </div>
                  ))}
              </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
