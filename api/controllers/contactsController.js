
import httpStatus from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import contactsService from "../services/contactsService.js";
import { CONTACT_TYPE } from "../../common/scopes.js";
import { isValidUUID } from "../utils/validators.js";

const getAllContacts = async (req, res) => {
  try {
    const { data, error } = await contactsService.fetchContacts(req.supabase);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      contacts: data || [],
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid contact ID",
      });
    }

    const { data, error } = await contactsService.fetchContactById(req.supabase, id);

    if (error || !data) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "FAILED",
        message: "Contact not found",
      });
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      contact: data,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const getContactsByUserId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.sendErrorEmptyParam("id");
  }

  if (!isValidUUID(id)) {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: "FAILED",
      message: "Invalid user ID",
    });
  }

  try {
    const { data, error } = await contactsService.fetchContacts(req.supabase, id);
    if (error) {
      return res.sendErrorServer(error);
    }

    return res.status(httpStatus.OK).json({
      status: "OK",
      contacts: data || [],
    });
  } catch (e) {
    return res.sendErrorServer(e);
  }
};

const createContact = async (req, res) => {
  try {
    const {body} = req;
    const requiredProps = [
      "user_id",
      "type",
      "content"
    ];

    if (res.sendErrorEmptyBody(requiredProps)) {
      return;
    }

    if (!isValidUUID(body.user_id)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid user ID",
      });
    }

    if (!CONTACT_TYPE.isDefined(body.type)) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "FAILED",
        message: "Invalid contact type",
      });
    }

    // Check for duplicate contact
    const { data: existingContact, error: checkError } =
      await contactsService.checkExistingContact(req.supabase, body.user_id, body.type, body.content);

    if (checkError) {
      return res.sendErrorServer(checkError);
    }

    if (existingContact?.length > 0) {
      return res.status(httpStatus.CONFLICT).json({
        status: "FAILED",
        message: "Contact already exists",
      });
    }

    const contactData = {
      id: uuidv4(),
      user_id: body.user_id,
      type: body.type,
      content: body.content,
    };

    const { data, error } = await contactsService.insertContact(req.supabase, contactData);

    if (error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: "FAILED",
        message: error.message,
      });
    }

    return res.status(httpStatus.CREATED).json({
      status: "CREATED",
      message: "Contact successfully created",
      contact: data[0],
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const updateContact = async (req, res) => {
  const { id } = req.params;
  const { type, content } = req.body;

  try {
    if (!id || !isValidUUID(id)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid contact ID"
      });
    }

    const updates = {};
    if (type !== undefined) {
      if (!CONTACT_TYPE.isDefined(type)) {
        return res.status(httpStatus.BAD_REQUEST).json({
          status: "FAILED",
          message: "Invalid contact type",
        });
      }
      updates.type = type;
    }
    if (content !== undefined) updates.content = content;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        status: "FAILED",
        message: "No fields to update"
      });
    }

    const { data, error } = await contactsService.updateContact(req.supabase, id, updates);

    if (error) {
      if (error.details?.includes("not found")) {
        return res.status(404).json({
          status: "FAILED",
          message: "Contact not found"
        });
      }
      throw error;
    }

    return res.status(200).json({
      status: "UPDATED",
      message: "Contact successfully updated",
      contact: data[0]
    });
  } catch (err) {
    return res.status(500).json({
      status: "FAILED",
      message: err.message
    });
  }
};

const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id || !isValidUUID(id)) {
      return res.status(400).json({
        status: "FAILED",
        message: "Invalid contact ID"
      });
    }

    const { error } = await contactsService.deleteContact(req.supabase, id);

    if (error) {
      if (error.details?.includes("not found")) {
        return res.status(404).json({
          status: "FAILED",
          message: "Contact not found"
        });
      }
      throw error;
    }

    return res.status(200).json({
      status: "DELETED",
      message: "Contact successfully deleted"
    });
  } catch (err) {
    return res.status(500).json({
      status: "FAILED",
      message: err.message
    });
  }
};

const contactsController = {
  getAllContacts,
  getContactById,
  getContactsByUserId,
  createContact,
  updateContact,
  deleteContact,
};

export default contactsController;