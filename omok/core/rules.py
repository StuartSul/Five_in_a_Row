class Rules:
    DIRECTIONS = {
        'W-E' : (0, 1),
        'NW-SE': (1, 1),
        'N-S' : (1, 0),
        'NE-SW': (1, -1)
    }

    @staticmethod
    def is_defeat(board, i, j):
        for direction in Rules.DIRECTIONS.values():
            if Rules.count(board, i, j, direction) == 5:
                return True
        return False

    @staticmethod
    def is_three(board, i, j):
        # TODO: implement checker method for violation of three by three rule
        return False

    @staticmethod
    def count(board, i, j, direction):
        total = 1
        height = len(board)
        width = len(board[0])

        for weight in [-1, 1]:
            for index in range(1, 6):
                _i = i + weight * index * direction[0]
                _j = j + weight * index * direction[1]
                if _i < 0 or _j < 0 or _i >= height or _j >= height:
                    break
                if board[i][j] == board[_i][_j]:
                    total += 1
                else:
                    break

        return total