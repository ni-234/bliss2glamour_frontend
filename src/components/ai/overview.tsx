import { motion } from "framer-motion";

import { MessageIcon } from "./icons";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-row justify-center gap-4 items-center">
          <MessageIcon size={32} />
        </p>
        <p className="font-medium">Welcome to Bliss2Glamour Bot! ✨</p>
        <p>
          Hi there, gorgeous! I’m your personal beauty assistant, here to help
          you discover the best in skincare, cosmetics, and all things glam.
          Whether you’re looking for product recommendations, expert tips, or
          just some beauty inspiration, I’ve got you covered. Let’s make your
          beauty routine as blissful and fabulous as you are!
        </p>
        <p>
          Got beauty questions? Ask away, I’m here to spill all the cosmetic
          secrets! 💄✨
        </p>
      </div>
    </motion.div>
  );
};
