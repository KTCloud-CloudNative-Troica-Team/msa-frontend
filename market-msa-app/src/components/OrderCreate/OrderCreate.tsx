import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Paper,
  Container
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  DeleteForeverOutlined as DeleteIcon,
  AddShoppingCart as AddCartIcon,
  ShoppingBasket as BasketIcon
} from '@mui/icons-material';

import type { Inventory } from "@typedef/InventoryType";
import type { Product } from "@typedef/ProductType";

type Props = {
  productInventoriesInfo: [Product, Inventory[]][];
  selectedOrderItem: [Product, Inventory, number][];
  onCreateButtonClicked: () => void;
  addProductInventoryItem: (p: Product, i: Inventory) => void;
  removeProductInventoryItem: (p: Product, i: Inventory) => void;
  updateProductInventoryItemQuantity: (p: Product, i: Inventory, q: number) => void;
};

const OrderCreate = ({
  productInventoriesInfo,
  selectedOrderItem,
  onCreateButtonClicked,
  addProductInventoryItem,
  removeProductInventoryItem,
  updateProductInventoryItemQuantity,
}: Props) => {

  const getSelectedItem = (inventoryId: number) => {
    return selectedOrderItem.find(([_, inv]) => inv.id === inventoryId);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold" color="text.primary">
          주문 생성
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<BasketIcon />}
          onClick={onCreateButtonClicked}
          disabled={selectedOrderItem.length === 0}
          sx={{ borderRadius: 2, px: 4, fontWeight: 'bold' }}
        >
          주문 완료 ({selectedOrderItem.length})
        </Button>
      </Box>

      <Stack spacing={4}>
        {productInventoriesInfo.map(([product, inventories]) => (
          <Card key={product.id} variant="outlined" sx={{ borderRadius: 3, boxShadow: 1 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  {product.price.toLocaleString()}원
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                {inventories.map((inventory) => {
                  const selected = getSelectedItem(inventory.id);
                  const isAdded = !!selected;
                  const currentQuantity = selected ? selected[2] : 0;

                  return (
                    <Paper
                      key={inventory.id}
                      variant="outlined"
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: 2,
                        bgcolor: isAdded ? 'action.hover' : 'background.paper',
                        borderColor: isAdded ? 'primary.light' : 'divider',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" color="text.primary">
                          SKU: {inventory.skuCode}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          가용 재고: {inventory.quantity}개
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" gap={2}>
                        {isAdded && (
                          <Box
                            display="flex"
                            alignItems="center"
                            sx={{ border: 1, borderColor: 'divider', borderRadius: 1, bgcolor: 'white' }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => updateProductInventoryItemQuantity(product, inventory, -1)}
                            >
                              <RemoveIcon fontSize="small" />
                            </IconButton>
                            <Typography sx={{ mx: 2, minWidth: 20, textAlign: 'center', fontWeight: 'bold' }}>
                              {currentQuantity}
                            </Typography>
                            <IconButton
                              size="small"
                              disabled={currentQuantity >= inventory.quantity}
                              onClick={() => updateProductInventoryItemQuantity(product, inventory, 1)}
                            >
                              <AddIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        )}

                        {isAdded ? (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => removeProductInventoryItem(product, inventory)}
                          >
                            삭제
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<AddCartIcon />}
                            onClick={() => addProductInventoryItem(product, inventory)}
                          >
                            추가
                          </Button>
                        )}
                      </Box>
                    </Paper>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {productInventoriesInfo.length === 0 && (
        <Paper
          variant="outlined"
          sx={{
            py: 10,
            textAlign: 'center',
            borderRadius: 3,
            borderStyle: 'dashed',
            bgcolor: 'grey.50',
          }}
        >
          <Typography color="text.secondary">표시할 상품 정보가 없습니다.</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default OrderCreate;