import {
  BoltIcon,
  ExclamationTriangleIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
function EmptyChat() {
  return (
    <main
      className="flex  h-full flex-col items-center justify-center px-2 text-white
    "
    >
      <h1 className="mb-20 text-5xl font-bold">chatGPT</h1>
      <section className="flex flex-col space-x-2 md:flex-row">
        <section className="mb-5 flex flex-col items-center  gap-4">
          <section className="flex flex-col items-center justify-center">
            <SunIcon className="h-8 w-8" />
            <h2>Examples</h2>
          </section>
          <ul className="space-y-2">
            <li>
              <p className="infoText">"Explain something to me"</p>
            </li>
            <li>
              <p className="infoText">
                "What is the difference between a dog and a cat"
              </p>
            </li>
            <li>
              <p className="infoText">"What is the color of the sun?"</p>
            </li>
          </ul>
        </section>
        <section className="mb-5 flex flex-col items-center  gap-4">
          <section className="flex flex-col items-center justify-center">
            <BoltIcon className="h-8 w-8" />
            <h2>Capabilites</h2>
          </section>
          <ul className="space-y-2">
            <li>
              <p className="infoText">
                Remembers what user said earlier in the conversation
              </p>
            </li>
            <li>
              <p className="infoText">
                Allows user to provide follow-up corrections
              </p>
            </li>
            <li>
              <p className="infoText">
                Trained to decline inappropriate requests
              </p>
            </li>
          </ul>
        </section>
        <section className="mb-5 flex flex-col items-center  gap-4">
          <section className="flex flex-col items-center justify-center">
            <ExclamationTriangleIcon className="h-8 w-8" />
            <h2>Limitations</h2>
          </section>
          <ul className="space-y-2">
            <li>
              <p className="infoText">
                May occasionally generate incorrect information
              </p>
            </li>
            <li>
              <p className="infoText">
                May occasionally produce harmful instructions or biased content
              </p>
            </li>
            <li>
              <p className="infoText">
                Limited knowledge of world and events after 2021
              </p>
            </li>
          </ul>
        </section>
      </section>
    </main>
  );
}

export default EmptyChat;
