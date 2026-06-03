type GuestRecord = Record<string, unknown>;

function asRecord(value: unknown): GuestRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as GuestRecord) : {};
}

function readString(source: GuestRecord, keys: string[]): string | null {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }
  return null;
}

function combineDateTime(date: string | null, time: string | null): string | null {
  if (!date) return null;
  if (!time) return date;
  if (date.includes("T")) return date;
  return `${date}T${time}`;
}

export function mapGuestInvitationDataToInvitationColumns(invitationData: unknown) {
  const inv = asRecord(invitationData);

  const groomNick =
    readString(inv, ["groomNickname", "groom_nickname", "groom_name", "groomName"]) ??
    readString(inv, ["groomFullName", "groom_full_name"]) ??
    "Mempelai Pria";
  const brideNick =
    readString(inv, ["brideNickname", "bride_nickname", "bride_name", "brideName"]) ??
    readString(inv, ["brideFullName", "bride_full_name"]) ??
    "Mempelai Wanita";

  const akadDate =
    readString(inv, ["akadDatetime", "akad_datetime"]) ??
    combineDateTime(readString(inv, ["akadDate", "akad_date"]), readString(inv, ["akadTime", "akad_time"]));
  const resepsiDate =
    readString(inv, ["resepsiDatetime", "resepsi_datetime", "receptionDatetime", "reception_datetime"]) ??
    combineDateTime(
      readString(inv, ["resepsiDate", "receptionDate", "reception_date"]),
      readString(inv, ["resepsiTime", "receptionTime", "reception_time"]),
    );
  const venue = readString(inv, ["venue"]);
  const address = readString(inv, ["address"]);

  return {
    title: `Pernikahan ${groomNick} & ${brideNick}`,
    groomNick,
    brideNick,
    columns: {
      title: `Pernikahan ${groomNick} & ${brideNick}`,
      groom_full_name: readString(inv, ["groomFullName", "groom_full_name", "groom_name", "groomName"]) ?? groomNick,
      groom_nickname: groomNick,
      groom_father_name: readString(inv, ["groomFatherName", "groomFather", "groom_father_name", "groom_father"]),
      groom_mother_name: readString(inv, ["groomMotherName", "groomMother", "groom_mother_name", "groom_mother"]),
      bride_full_name: readString(inv, ["brideFullName", "bride_full_name", "bride_name", "brideName"]) ?? brideNick,
      bride_nickname: brideNick,
      bride_father_name: readString(inv, ["brideFatherName", "brideFather", "bride_father_name", "bride_father"]),
      bride_mother_name: readString(inv, ["brideMotherName", "brideMother", "bride_mother_name", "bride_mother"]),
      akad_datetime: akadDate,
      akad_location_name: readString(inv, ["akadLocationName", "akad_location_name", "akadVenue", "akad_venue"]) ?? venue,
      akad_location_address:
        readString(inv, ["akadLocationAddress", "akad_location_address", "akadAddress", "akad_address"]) ?? address,
      resepsi_datetime: resepsiDate,
      resepsi_location_name:
        readString(inv, ["resepsiLocationName", "resepsi_location_name", "receptionVenue", "reception_venue"]) ?? venue,
      resepsi_location_address:
        readString(inv, ["resepsiLocationAddress", "resepsi_location_address", "receptionAddress", "reception_address"]) ?? address,
      quote_text: readString(inv, ["quoteText", "quote_text", "quote", "greetingText", "greeting_text"]),
      quote_source: readString(inv, ["quoteSource", "quote_source"]),
      music_url: readString(inv, ["musicUrl", "music_url"]),
      gift_bank_name: readString(inv, ["giftBankName", "gift_bank_name", "bankName"]),
      gift_bank_account: readString(inv, ["giftBankAccount", "gift_bank_account", "bankAccount"]),
      gift_bank_account_name: readString(inv, ["giftBankAccountName", "gift_bank_account_name", "bankAccountName"]),
      gift_shipping_address: readString(inv, ["giftShippingAddress", "gift_shipping_address", "giftAddress"]),
    },
  };
}
