import { expect, test } from '@playwright/test';

import { useServer } from '../testing/useServer.js';
import { WaitHandle } from '../testing/utils.js';

const serverInfo = useServer();

test.describe('landing page', () => {
  test('shows app heading', async ({ page }) => {
    await page.goto(`${serverInfo.baseURL}/`);

    await expect(
      page.getByRole('heading', { name: 'Pet Store' })
    ).toBeVisible();
  });

  test('add pet button is only enabled after the first fetch', async ({
    page,
  }) => {
    const waitHandle = new WaitHandle();

    await page.route(`${serverInfo.baseURL}/api/pet/kinds`, async (route) => {
      await waitHandle.wait();
      await route.fallback();
    });

    await page.goto(`${serverInfo.baseURL}/`);

    await expect(page.getByRole('button', { name: 'Add Pet' })).toBeDisabled();

    const loadingIndicator = page.getByTestId('loading-indicator');
    await expect(loadingIndicator).toBeVisible();
    waitHandle.release();
    await expect(loadingIndicator).toBeHidden();

    await expect(page.getByRole('button', { name: 'Add Pet' })).toBeEnabled();
  });

  test('displays a list of pets', async ({ page }) => {
    const waitHandle = new WaitHandle();

    await page.route(`${serverInfo.baseURL}/api/pet/kinds`, async (route) => {
      await waitHandle.wait();
      await route.fallback();
    });

    await page.goto(`${serverInfo.baseURL}/`);

    const loadingIndicator = page.getByTestId('loading-indicator');
    await expect(loadingIndicator).toBeVisible();
    waitHandle.release();
    await expect(loadingIndicator).toBeHidden();

    const table = page.getByRole('table');
    const rows = table.getByRole('row', { name: 'Pet', exact: true });
    await expect(rows).toHaveCount(3);
  });

  test('shows an error indicator when the all pets endpoint fails', async ({
    page,
  }) => {
    const waitHandle = new WaitHandle();

    await page.route(`${serverInfo.baseURL}/api/pet/all`, async (route) => {
      await waitHandle.wait();
      await route.fulfill({ status: 500 });
    });

    await page.goto(`${serverInfo.baseURL}/`);

    const loadingIndicator = page.getByTestId('loading-indicator');
    await expect(loadingIndicator).toBeVisible();
    waitHandle.release();
    await expect(loadingIndicator).toBeHidden();

    const errorIndicator = page.getByTestId('error-indicator');
    await expect(errorIndicator).toBeVisible();
  });

  test('shows an error indicator when the pet kinds endpoint fails', async ({
    page,
  }) => {
    const waitHandle = new WaitHandle();

    await page.route(`${serverInfo.baseURL}/api/pet/kinds`, async (route) => {
      await waitHandle.wait();
      await route.fulfill({ status: 500 });
    });

    await page.goto(`${serverInfo.baseURL}/`);

    const loadingIndicator = page.getByTestId('loading-indicator');
    await expect(loadingIndicator).toBeVisible();
    waitHandle.release();
    await expect(loadingIndicator).toBeHidden();

    const errorIndicator = page.getByTestId('error-indicator');
    await expect(errorIndicator).toBeVisible();
  });
});

test.describe('modals', () => {
  test('view / edit button brings up the details modal and cancel closes it', async ({
    page,
  }) => {
    await page.goto(`${serverInfo.baseURL}/`);

    const petsTable = page.getByRole('table');
    const petRow = petsTable
      .getByRole('row', { name: 'Pet', exact: true })
      .first();

    await petRow.getByRole('button', { name: 'View / Edit' }).click();

    const editModal = page.getByRole('dialog', { name: 'View pet modal' });

    await expect(editModal).toBeVisible();

    await editModal.getByRole('button', { name: 'Cancel' }).click();

    await expect(editModal).toBeHidden();
  });

  test('delete button brings up the delete modal and cancel closes it', async ({
    page,
  }) => {
    await page.goto(`${serverInfo.baseURL}/`);

    const petsTable = page.getByRole('table');
    const petRow = petsTable
      .getByRole('row', { name: 'Pet', exact: true })
      .first();

    await petRow.getByRole('button', { name: 'Delete' }).click();

    const deleteModal = page.getByRole('dialog', { name: 'Delete pet modal' });

    await expect(deleteModal).toBeVisible();

    await deleteModal.getByRole('button', { name: 'Cancel' }).click();

    await expect(deleteModal).toBeHidden();
  });

  test('add buttons brings up the add modal and cancel closes it', async ({
    page,
  }) => {
    await page.goto(`${serverInfo.baseURL}/`);

    await page.getByRole('button', { name: 'Add Pet' }).click();

    const addModal = page.getByRole('dialog', {
      name: 'Add pet modal',
    });

    await expect(addModal).toBeVisible();

    await addModal.getByRole('button', { name: 'Cancel' }).click();

    await expect(addModal).toBeHidden();
  });
});

test.describe('re-fresh pet list', () => {
  test('re-fetches the list of pets when a pet is deleted', async ({
    page,
  }) => {
    await page.goto(`${serverInfo.baseURL}/`);

    const petsTable = page.getByRole('table');
    const petRows = petsTable.getByRole('row', { name: 'Pet', exact: true });

    await petRows.first().getByRole('button', { name: 'Delete' }).click();

    const deleteModal = page.getByRole('dialog', { name: 'Delete pet modal' });

    await expect(deleteModal).toBeVisible();

    await deleteModal.getByRole('button', { name: 'Confirm' }).click();

    await expect(petRows).toHaveCount(2);
  });

  // test('re-fetches the list of pets when a pet is saved', async () => {
  //   const user = userEvent.setup();
  //
  //   render(<App />);
  //
  //   const table = await screen.findByRole('table');
  //   const row = within(table).getAllByRole('row', { name: 'Pet' })[0];
  //
  //   await user.click(within(row).getByRole('button', { name: 'View / Edit' }));
  //
  //   const editModal = await screen.findByRole('dialog', {
  //     name: 'View pet modal',
  //   });
  //
  //   await user.click(within(editModal).getByRole('button', { name: 'Edit' }));
  //
  //   await waitFor(() => {
  //     expect(
  //       within(editModal).getByRole('heading', { name: 'Edit pet' })
  //     ).toBeInTheDocument();
  //   });
  //
  //   await user.type(within(editModal).getByLabelText('Name:'), '_new');
  //
  //   const onPetListEndpoint = jest.fn();
  //   const onPetKindsEndpoint = jest.fn();
  //
  //   server.use(
  //     http.get(`${BASE_URL}/pet/all`, () => {
  //       onPetListEndpoint();
  //       return HttpResponse.json([]);
  //     }),
  //     http.get(`${BASE_URL}/pet/kinds`, () => {
  //       onPetKindsEndpoint();
  //       return HttpResponse.json([]);
  //     })
  //   );
  //
  //   await user.click(
  //     await within(editModal).findByRole('button', { name: 'Save' })
  //   );
  //
  //   await waitFor(() => {
  //     expect(onPetListEndpoint).toHaveBeenCalled();
  //   });
  //
  //   await waitFor(() => {
  //     expect(onPetKindsEndpoint).not.toHaveBeenCalled();
  //   });
  // });
});
