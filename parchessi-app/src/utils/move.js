import { getId } from "./piece";
import { getOrder, getType } from "./name";

// Hàm lấy các MOVE xuất chuồng
export const getMoveStart = (game, piece) => {
  // Lấy thứ tự của PIECE và loại NODE hiện tại
  const pieceOrder = getOrder(piece);
  const nodeType = getType(game.currNode[pieceOrder]);
  const nextNode = "b-" + (game.turn * 14 + 1);

  // Nếu PIECE đang không trong chuồng, không có MOVE hợp lệ
  if (nodeType !== "a") return [];

  // Nếu kết quả xúc xắc không phải 1 hoặc 6, không có MOVE hợp lệ
  if (game.dice !== 1 && game.dice !== 6) return [];

  // Tìm PIECE có vị trí ở NODE xuất chuồng
  const nextPieceOrder = game.currNode.findIndex((node) => node === nextNode);
  const nextPiece = "p-" + nextPieceOrder;

  // Nếu không có PIECE nào ở đó, xuất chuồng
  if (nextPieceOrder === -1) return [{ piece: piece, node: nextNode }];

  // Nếu có PIECE của người chơi khác, xuất chuồng và đá
  if (getId(piece) !== getId(nextPiece))
    return [
      { piece: piece, node: nextNode },
      { piece: nextPiece, node: "a-" + nextPieceOrder },
    ];

  // Nếu có PIECE của người chơi hiện tại, không có MOVE hợp lệ
  return [];
};

// Hàm lấy các MOVE khi PIECE đang trên đường đua
export const getMoveRacing = (game, piece) => {
  // Lấy thứ tự của PIECE và loại NODE hiện tại
  const pieceOrder = getOrder(piece);
  const nodeOrder = getOrder(game.currNode[pieceOrder]);
  const nodeType = getType(game.currNode[pieceOrder]);
  const nextNode = "b-" + ((nodeOrder + game.dice) % 56);

  // Nếu PIECE đang không trên đường đua, không có MOVE hợp lệ
  if (nodeType !== "b") return [];

  // Nếu PIECE đã đi hết đường đua
  if (nodeOrder === game.turn * 14) {
    for (let i = 0; i < game.dice; i++)
      // Nếu có vật cản, không có MOVE hợp lệ
      if (game.currNode.find((node) => node === "c-" + (game.turn * 6 + i))) return [];

    // Nếu không có vật cản, vào chuồng
    return [{ piece: piece, node: "c-" + (game.turn * 6 + game.dice - 1) }];
  }

  // Nếu để tới NODE tiếp theo cần đi quá 1 vòng, không có MOVE hợp lệ
  for (let i = nodeOrder; i < nodeOrder + game.dice; i++) if (i % 56 === game.turn * 14) return [];

  // Nếu để tới NODE tiếp theo cần đi qua vật cản, không có MOVE hợp lệ
  for (let i = 1; i < game.dice; i++)
    if (game.currNode.find((node) => node === "b-" + ((nodeOrder + i) % 56))) return [];

  // Tìm PIECE có vị trí ở NODE tiếp theo
  const nextPieceOrder = game.currNode.findIndex((node) => node === nextNode);
  const nextPiece = "p-" + nextPieceOrder;

  // Nếu không có PIECE nào ở đó, di chuyển
  if (nextPieceOrder === -1) return [{ piece: piece, node: nextNode }];

  // Nếu có PIECE của người chơi khác, di chuyển và đá
  if (getId(piece) !== getId(nextPiece))
    return [
      { piece: piece, node: nextNode },
      { piece: nextPiece, node: "a-" + nextPieceOrder },
    ];

  // Nếu có PIECE của người chơi hiện tại, không có MOVE hợp lệ
  return [];
};

// Hàm lấy các MOVE vào chuồng
export const getMoveEnd = (game, piece) => {
  // Lấy thứ tự của PIECE và loại NODE hiện tại
  const pieceOrder = getOrder(piece);
  const nodeOrder = getOrder(game.currNode[pieceOrder]);
  const nodeType = getType(game.currNode[pieceOrder]);
  const nextNode = "c-" + (nodeOrder + 1);

  // Nếu PIECE đang không trong chuồng, không có MOVE hợp lệ
  if (nodeType !== "c") return [];

  // Nếu PIECE đã ở trong cùng của chuồng, không có MOVE hợp lệ
  if (nodeOrder === game.turn * 6 + 5) return [];

  // Nếu kết quả xúc xắc không đúng, không có MOVE hợp lệ
  if (game.dice !== 1 && game.dice !== (nodeOrder % 6) + 2) return [];

  // Nếu đã có PIECE khác ở NODE tiếp theo, không có MOVE hợp lệ
  if (game.currNode.find((node) => node === nextNode)) return [];

  // Nếu mọi thứ đều ổn, tăng bậc trong chuồng
  return [{ piece: piece, node: nextNode }];
};
