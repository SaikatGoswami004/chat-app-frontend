import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";

const ProfileModel = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="33px"
            fontFamily="Work sans"
            d={"flex"}
            justifyContent={"center"}
            style={{display:"flex",justifyContent:"center"}}
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody style={{display:"flex",justifyContent:"center",flexDirection:"column"}}>
            <Image boxSize="150px" src={user.image} alt={user.name} style={{marginLeft:"10rem",borderRadius:"50%"}} />
            <Text
              fontSize={{ base: "23px", md: "25px" }}
              fontFamily="Work sans"
              style={{marginLeft:"2rem"}}
            >
              Email: {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button> */}
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModel;
