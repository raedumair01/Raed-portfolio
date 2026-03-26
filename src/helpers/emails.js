import emailjs from "@emailjs/browser";

const _status = {
    didInit: false,
    config: null
}

const _successResult = () => ({
    ok: true,
    error: null
})

const _errorResult = (error) => ({
    ok: false,
    error: error?.text || error?.message || "Unknown EmailJS error"
})

export const useEmails = () => {
    /**
     * @param {Object} config
     */
    const init = (config) => {
        emailjs.init(config.publicKey)
        _status.config = config
        _status.didInit = true
    }

    /**
     * @return {boolean}
     */
    const isInitialized = () => {
        return _status.didInit
    }

    const hasAutoReplyEnabled = () => {
        return Boolean(_status.config?.autoReplyTemplateId)
    }

    /**
     * @param {string} fromName
     * @param {string} fromEmail
     * @param {string} customSubject
     * @param {string }message
     * @return {Promise<boolean>|Boolean}
     */
    const sendContactEmail = async (fromName, fromEmail, customSubject, message) => {
        if(!isInitialized())
            return _errorResult(new Error("Email service is not initialized"))

        const params = {
            from_name: fromName,
            from_email: fromEmail,
            reply_to: fromEmail,
            name: fromName,
            email: fromEmail,
            subject: customSubject,
            custom_subject: customSubject,
            title: customSubject,
            message: message,
            to_name: _status.config?.ownerName || "Raed Bin Umair",
            to_email: _status.config?.ownerEmail || ""
        }

        try {
            await emailjs.send(
                _status.config['serviceId'],
                _status.config['templateId'],
                params
            )
            return _successResult()
        } catch (error) {
            console.error("[EmailJS] Contact email failed", error)
            return _errorResult(error)
        }
    }

    /**
     * @param {string} toName
     * @param {string} toEmail
     * @param {string} originalSubject
     * @param {string} originalMessage
     * @return {Promise<boolean>|Boolean}
     */
    const sendAutoReplyEmail = async (toName, toEmail, originalSubject, originalMessage) => {
        if(!isInitialized() || !hasAutoReplyEnabled())
            return _successResult()

        const params = {
            to_name: toName,
            to_email: toEmail,
            reply_to: _status.config?.ownerEmail || "",
            from_name: _status.config?.autoReplyFromName || _status.config?.ownerName || "Portfolio Contact",
            from_email: _status.config?.ownerEmail || "",
            name: toName,
            email: toEmail,
            subject: _status.config?.autoReplySubject || "Thanks for reaching out",
            original_subject: originalSubject,
            original_message: originalMessage
        }

        try {
            await emailjs.send(
                _status.config['serviceId'],
                _status.config['autoReplyTemplateId'],
                params
            )
            return _successResult()
        } catch (error) {
            console.error("[EmailJS] Auto-reply email failed", error)
            return _errorResult(error)
        }
    }

    return {
        init,
        isInitialized,
        hasAutoReplyEnabled,
        sendContactEmail,
        sendAutoReplyEmail
    }
}
