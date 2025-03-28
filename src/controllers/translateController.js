const translate = async (req, res) => {
  const deeplApiKey = process.env.DEEPL_API_KEY;
  const deepApiUrl = process.env.DEEPL_API_URL;

  const { text } = req.body;

  try {
    if (text.trim() === "") {
      return res.status(400).json({ message: "Text cannot be empty" });
    }

    if (!deeplApiKey) {
      return res.status(500).json({ message: "DeepL API key not configured" });
    }

    const formData = new URLSearchParams();

    formData.append("text", text);
    formData.append("target_lang", "en");
    formData.append("source_lang", "uk");

    const response = await fetch(deepApiUrl, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${deeplApiKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        message: `DeepL API error: ${response.statusText}`,
        details: errorText,
      });
    }

    const data = await response.json();
    translatedText = data.translations[0].text;

    res.status(200).json({ translatedText });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { translate };
