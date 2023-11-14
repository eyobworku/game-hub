import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const GameCardContainer = ({ children }: Props) => {
  return (
    <Box width="300px" borderRadius={10} overflow={"hidden"} padding="10px">
      {children}
    </Box>
  );
};

export default GameCardContainer;
